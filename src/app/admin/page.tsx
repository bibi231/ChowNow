'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OrderStatusSelect from '@/components/OrderStatusSelect';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="container py-5 mt-5 text-center h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  return (
    <div className="container-fluid py-5 mt-4" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
      <div className="row mb-4 px-lg-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bolder mb-0"><i className="bi bi-display me-2 text-primary"></i>Kitchen Display System</h2>
            <p className="text-muted mb-0">Manage live restaurant orders and fulfillment</p>
          </div>
          <button className="btn btn-light shadow-sm border" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>
      </div>

      <div className="row px-lg-4 g-4">
        {/* Active Orders Grid */}
        <div className="col-12 mb-4">
          <h4 className="fw-bold mb-3 d-flex align-items-center">
            Active Orders <span className="badge bg-primary ms-3 rounded-pill">{activeOrders.length}</span>
          </h4>
          <div className="row g-4">
            {activeOrders.length === 0 ? (
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4 bg-body text-center py-5">
                  <i className="bi bi-cup-hot text-muted display-4 mb-3"></i>
                  <p className="text-muted mb-0">No active orders right now. The kitchen is clear!</p>
                </div>
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className={`card border-0 shadow-sm rounded-4 h-100 ${order.status === 'PENDING' ? 'border-top border-warning border-4' : order.status === 'READY_FOR_PICKUP' ? 'border-top border-success border-4' : 'border-top border-primary border-4'}`}>
                    <div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">#{order.id.slice(-6).toUpperCase()}</h5>
                      <span className="badge bg-body-tertiary text-body shadow-sm">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3 text-muted small">
                         <i className="bi bi-person-circle me-2"></i>{order.user?.name}
                      </div>

                      <div className="bg-body-tertiary p-3 rounded-3 mb-3">
                        <ul className="list-unstyled mb-0 m-0">
                          {order.items.map((item: any, idx: number) => (
                            <li key={idx} className="d-flex justify-content-between align-items-center mb-2 fw-medium border-bottom pb-2 last-child-no-border">
                              <span><span className="badge bg-secondary me-2">{item.quantity}x</span> {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                         <span className="text-muted small">Total</span>
                         <span className="fw-bold fs-5 text-primary">₦{order.total.toLocaleString()}</span>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between align-items-center bg-body-tertiary border rounded px-2 py-1">
                          <small className="text-muted">Payment:</small>
                          <small className={order.paymentRef ? 'text-success fw-bold' : 'text-warning fw-bold'}>
                            {order.paymentMethod} {order.paymentRef ? <i className="bi bi-check-circle-fill ms-1"></i> : null}
                          </small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center bg-body-tertiary border rounded px-2 py-1">
                          <small className="text-muted">Pickup Code:</small>
                          <small className="fw-bolder text-monospace fs-6">{order.status === 'READY_FOR_PICKUP' ? order.pickupCode : '---'}</small>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-4 pt-0">
                      <OrderStatusSelect 
                        orderId={order.id} 
                        currentStatus={order.status} 
                        onUpdate={fetchOrders} 
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Orders List */}
        <div className="col-12 mt-5">
           <h4 className="fw-bold mb-3 d-flex align-items-center">
            Completed / Cancelled <span className="badge bg-secondary ms-3 rounded-pill">{completedOrders.length}</span>
          </h4>
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Time</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th className="pe-4 text-end">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4 text-muted">No completed orders.</td></tr>
                    ) : (
                      completedOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="ps-4 fw-bold">#{order.id.slice(-6).toUpperCase()}</td>
                          <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                          <td>{order.user?.name}</td>
                          <td className="fw-bold text-success">₦{order.total.toLocaleString()}</td>
                          <td>
                             <span className={`badge ${order.status === 'DELIVERED' ? 'bg-success' : 'bg-danger'}`}>
                                {order.status}
                             </span>
                          </td>
                          <td className="pe-4 text-end">
                            <small className="text-muted">{order.paymentMethod}</small>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
