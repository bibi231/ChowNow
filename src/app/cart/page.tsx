'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'danger'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`alert alert-${type} alert-dismissible d-flex align-items-center shadow`}
      role="alert"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        minWidth: '280px', borderRadius: '12px', animation: 'fadeInUp 0.3s ease',
      }}
    >
      <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`} />
      {msg}
      <button type="button" className="btn-close ms-auto" onClick={onClose} />
    </div>
  );
}

const DELIVERY_FEE = 500;

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'bank' | 'card'>('bank');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'danger' } | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const showToast = useCallback((msg: string, type: 'success' | 'danger') => setToast({ msg, type }), []);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQty = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) newCart.splice(index, 1);
    saveCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
    showToast('Item removed from cart.', 'danger');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      showToast('Please log in to place an order.', 'danger');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    if (cart.length === 0) return;

    setLoading(true);

    // Simulate Payment Gateway UI delay if using Mock Card
    if (paymentMode === 'card') {
      showToast('Connecting to secure payment gateway...', 'success');
      await new Promise(r => setTimeout(r, 1500));
    }

    try {
      const payload = { 
        items: cart, 
        total: total + DELIVERY_FEE,
        paymentRef: paymentMode === 'card' ? `TEST_PAY_${Math.floor(Math.random()*1000000)}` : null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        window.dispatchEvent(new Event('cartUpdated'));
        if (paymentMode === 'card') {
            showToast('Payment successful! Order placed.', 'success');
        } else {
            showToast('Order placed successfully!', 'success');
        }
        setTimeout(() => router.push('/account'), 1800);
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to place order.', 'danger');
      }
    } catch {
      showToast('Network error. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div className="bg-body-tertiary rounded-circle d-flex align-items-center justify-content-center mb-4" style={{width: 120, height: 120}}>
            <i className="bi bi-cart3 text-muted" style={{ fontSize: '3rem' }} />
        </div>
        <h2 className="fw-bold">Your cart is feeling light</h2>
        <p className="text-muted mb-4" style={{ maxWidth: 400 }}>Your cart is empty. Add some delicious items from our menu to get started!</p>
        <Link href="/menu" className="btn btn-primary btn-lg rounded-pill px-5 shadow">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4" style={{ minHeight: '70vh' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="fw-bolder mb-4 display-6">
        <i className="bi bi-cart-check me-2 text-primary" />Your Cart
      </h1>

      <div className="row g-4">
        {/* Cart items */}
        <div className="col-lg-7 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 border-0 rounded-top-start-4">Item</th>
                      <th className="py-3 border-0">Price</th>
                      <th className="py-3 border-0">Qty</th>
                      <th className="text-end py-3 border-0">Subtotal</th>
                      <th className="pe-4 border-0 rounded-top-end-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-3 flex-shrink-0 shadow-sm"
                              style={{
                                width: 70, height: 70,
                                backgroundImage: `url(${item.image?.startsWith('http') ? item.image : `/${item.image}`})`,
                                backgroundSize: 'cover', backgroundPosition: 'center',
                              }}
                            />
                            <div>
                              <div className="fw-bold fs-5">{item.name}</div>
                              <span className="badge bg-body-tertiary text-secondary border mt-1">{item.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="fw-medium text-muted">₦{item.price.toLocaleString()}</td>
                        <td>
                          <div className="input-group input-group-sm rounded-pill overflow-hidden shadow-sm" style={{ width: 120, border: '1px solid #dee2e6' }}>
                            <button className="btn btn-light border-0 px-3" onClick={() => updateQty(index, -1)}>−</button>
                            <input type="text" className="form-control text-center border-0 fw-bold bg-body" value={item.quantity} readOnly />
                            <button className="btn btn-light border-0 px-3" onClick={() => updateQty(index, 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-end fw-bolder text-primary fs-5">₦{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-danger rounded-circle" style={{ width: 35, height: 35 }} onClick={() => removeItem(index)}>
                            <i className="bi bi-x-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="col-lg-5 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: 100 }}>
            <div className="card-body p-4 p-xl-5">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal</span>
                <span className="fw-bold text-body">₦{total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Delivery Fee</span>
                <span className="fw-bold text-body">₦{DELIVERY_FEE.toLocaleString()}</span>
              </div>
              
              <hr className="my-4 border-secondary opacity-25" />
              
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fw-bold fs-5 text-muted">Total</span>
                <span className="fw-bolder fs-3 text-primary">₦{(total + DELIVERY_FEE).toLocaleString()}</span>
              </div>

              <div className="mb-4">
                 <label className="form-label fw-bold text-muted small text-uppercase mb-3">Payment Method</label>
                 
                 <div className={`card border-2 mb-2 p-3 ${paymentMode === 'bank' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle bg-body-tertiary'} cursor-pointer transition-all`}
                      onClick={() => setPaymentMode('bank')} style={{ cursor: 'pointer' }}>
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                      <input className="form-check-input mt-0" type="radio" checked={paymentMode === 'bank'} readOnly />
                      <label className="form-check-label fw-medium w-100 cursor-pointer text-body">
                        Cash / Bank Transfer
                      </label>
                      <i className="bi bi-bank text-primary ms-auto fs-5"></i>
                    </div>
                 </div>

                 <div className={`card border-2 p-3 ${paymentMode === 'card' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle bg-body-tertiary'} cursor-pointer transition-all`}
                      onClick={() => setPaymentMode('card')} style={{ cursor: 'pointer' }}>
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                      <input className="form-check-input mt-0" type="radio" checked={paymentMode === 'card'} readOnly />
                      <div>
                        <label className="form-check-label fw-medium text-body d-block">
                          Pay with Card
                        </label>
                        <small className="text-muted d-block" style={{fontSize: 11}}>Test Environment</small>
                      </div>
                      <i className="bi bi-credit-card-2-front text-primary ms-auto fs-5"></i>
                    </div>
                 </div>
              </div>

              <button
                className={`btn btn-lg w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 ${paymentMode === 'card' ? 'btn-dark' : 'btn-primary'}`}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm" />Processing...</>
                ) : (
                  <>
                    <i className={paymentMode === 'card' ? "bi bi-credit-card" : "bi bi-bag-check"}></i>
                    {paymentMode === 'card' ? 'Pay Securely' : 'Place Order'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
