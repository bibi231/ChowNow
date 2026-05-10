'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    saveCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!session) {
      alert("Please login to place an order.");
      router.push('/login');
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total })
      });

      if (res.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        window.dispatchEvent(new Event('cartUpdated'));
        alert("Order placed successfully!");
        router.push('/account'); // Or a generic success view
      } else {
        alert("Failed to place order.");
      }
    } catch (e) {
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center" style={{ minHeight: '60vh' }}>
        <i className="bi bi-cart-x display-1 text-muted mb-3 d-block"></i>
        <h2 className="fw-bold">Your Cart is Empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/menu" className="btn btn-primary btn-lg rounded-pill px-4">Start Ordering</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4" style={{ minHeight: '70vh' }}>
      <h2 className="fw-bold mb-4"><i className="bi bi-cart3 me-2 text-primary"></i>Your Cart</h2>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table align-middle border-bottom-0 mb-0">
                  <thead className="table-light rounded-top">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="text-end">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-3 me-3 flex-shrink-0" 
                              style={{ width: '60px', height: '60px', backgroundImage: `url(${item.image.startsWith('http') ? item.image : `/${item.image}`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            ></div>
                            <div>
                              <h6 className="mb-0 fw-bold">{item.name}</h6>
                              <small className="text-muted">{item.category}</small>
                            </div>
                          </div>
                        </td>
                        <td>₦{item.price.toLocaleString()}</td>
                        <td>
                          <div className="input-group input-group-sm" style={{ width: '100px' }}>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => updateQty(index, -1)}>-</button>
                            <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => updateQty(index, 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-end fw-bold">₦{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
                            <i className="bi bi-trash"></i>
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
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '100px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold border-bottom pb-3 mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">₦{total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery Fee</span>
                <span className="fw-bold">₦500</span>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-primary">₦{(total + 500).toLocaleString()}</span>
              </div>
              <button 
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold" 
                onClick={handleCheckout} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
