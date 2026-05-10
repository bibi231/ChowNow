'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// ── Toast component ──────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'danger'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`alert alert-${type} alert-dismissible d-flex align-items-center shadow`}
      role="alert"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '280px',
        borderRadius: '12px',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
      {msg}
      <button type="button" className="btn-close ms-auto" onClick={onClose} />
    </div>
  );
}

// ── Star rating display ───────────────────────────────────────────────────────
function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const fontSize = size === 'lg' ? '1.4rem' : '0.85rem';
  return (
    <span style={{ fontSize }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bi ${s <= Math.round(rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
        />
      ))}
    </span>
  );
}

// ── Review Modal ──────────────────────────────────────────────────────────────
function ReviewModal({
  item,
  onClose,
  onToast,
}: {
  item: any | null;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'danger') => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (!item) return;
    fetch(`/api/reviews?menuItemId=${item.id}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        setAvgRating(d.avgRating || 0);
      })
      .catch(() => {});
  }, [item]);

  if (!item) return null;

  const handleSubmit = async () => {
    if (!session) {
      onToast('Please log in to leave a review.', 'danger');
      return;
    }
    if (rating === 0) {
      onToast('Please select a star rating.', 'danger');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: item.id, rating, comment }),
      });
      if (res.ok) {
        onToast('Review submitted!', 'success');
        setRating(0);
        setComment('');
        // Refresh reviews
        const d = await (await fetch(`/api/reviews?menuItemId=${item.id}`)).json();
        setReviews(d.reviews || []);
        setAvgRating(d.avgRating || 0);
      } else {
        const err = await res.json();
        onToast(err.message || 'Failed to submit review.', 'danger');
      }
    } catch {
      onToast('Network error. Try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-flex align-items-center justify-content-center"
      style={{ display: 'flex !important', background: 'rgba(0,0,0,0.55)', position: 'fixed', inset: 0, zIndex: 1055 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-lg w-100 m-3" style={{ maxWidth: '680px' }}>
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold">{item.name}</h5>
              <div className="d-flex align-items-center gap-2">
                <StarDisplay rating={avgRating} />
                <small className="text-muted">
                  {avgRating > 0 ? `${avgRating.toFixed(1)} · ${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
                </small>
              </div>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {/* Leave a review */}
            <div className="bg-body-tertiary rounded-3 p-3 mb-4">
              <h6 className="fw-bold mb-3">{session ? 'Leave a Review' : 'Log in to leave a review'}</h6>
              {session && (
                <>
                  <div className="d-flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        className="btn btn-link p-0"
                        style={{ fontSize: '1.8rem', color: s <= (hovered || rating) ? '#ffc107' : '#dee2e6' }}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(s)}
                      >
                        <i className="bi bi-star-fill" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="form-control mb-3"
                    rows={3}
                    placeholder="Share your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ borderRadius: '10px' }}
                  />
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </>
              )}
            </div>

            {/* Reviews list */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {reviews.length === 0 ? (
                <p className="text-muted text-center py-3">Be the first to review this dish!</p>
              ) : (
                reviews.map((r: any) => (
                  <div key={r.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                      style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}
                    >
                      {r.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{r.user?.name || 'Anonymous'}</span>
                        <StarDisplay rating={r.rating} />
                        <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                      {r.comment && <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>{r.comment}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Menu Page ────────────────────────────────────────────────────────────
export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'danger' } | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, number>>({});
  const [menuData, setMenuData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
         setMenuData(data);
         // Load reviews
         data.forEach((item: any) => {
           fetch(`/api/reviews?menuItemId=${item.id}`)
             .then(r => r.json())
             .then(d => {
               if (d.avgRating !== undefined) {
                 setRatingsMap(prev => ({ ...prev, [item.id]: d.avgRating }));
               }
             }).catch(() => {});
         });
      })
      .catch(console.error);
  }, []);

  const categories = ['All', ...Array.from(new Set(menuData.map((item) => item.category)))];
  const filteredMenu = activeCategory === 'All' ? menuData : menuData.filter((item) => item.category === activeCategory);

  const showToast = useCallback((msg: string, type: 'success' | 'danger') => {
    setToast({ msg, type });
  }, []);

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((c: any) => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`${item.name} added to cart!`, 'success');
  };



  return (
    <div className="container py-5 mt-4">
      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Review Modal */}
      <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} onToast={showToast} />

      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">Our Menu</h1>
        <p className="text-muted">Explore our wide variety of delicious meals</p>

        {/* Category tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn rounded-pill px-4 ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {filteredMenu.map((item) => {
          const avg = ratingsMap[item.id] ?? 0;
          return (
            <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {/* Food image */}
                <div
                  style={{
                    height: '200px',
                    backgroundImage: `url(${item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : `/${item.image}`)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <span
                    className="badge bg-body text-body position-absolute shadow-sm"
                    style={{ top: '10px', right: '10px', borderRadius: '8px', fontSize: '0.75rem' }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="card-body d-flex flex-column p-3">
                  <h5 className="fw-bold mb-1 text-truncate" title={item.name}>{item.name}</h5>

                  {/* Star rating row */}
                  <div className="d-flex align-items-center gap-1 mb-2">
                    <StarDisplay rating={avg} />
                    <small className="text-muted">
                      {avg > 0 ? avg.toFixed(1) : 'No ratings'}
                    </small>
                  </div>

                  <h5 className="text-primary fw-bold mb-3">₦{item.price.toLocaleString()}</h5>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-primary flex-grow-1 rounded-pill"
                      onClick={() => addToCart(item)}
                    >
                      <i className="bi bi-cart-plus me-1" /> Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-secondary rounded-pill px-3"
                      onClick={() => setReviewItem(item)}
                      title="View & Leave Reviews"
                    >
                      <i className="bi bi-chat-square-text" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
