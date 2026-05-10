import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container py-5 mt-4" style={{ minHeight: '70vh' }}>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4 text-center">
              <div 
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px', fontSize: '32px' }}
              >
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h4 className="fw-bold">{session?.user?.name}</h4>
              <p className="text-muted mb-2">{session?.user?.email}</p>
              <span className={`badge ${session?.user?.role === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                {session?.user?.role}
              </span>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="list-group list-group-flush rounded-4 overflow-hidden">
              <Link href="/account" className="list-group-item list-group-item-action active py-3 fw-medium">
                <i className="bi bi-bag me-2"></i> My Orders
              </Link>
              <Link href="/account/settings" className="list-group-item list-group-item-action py-3 fw-medium text-muted">
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 p-4 pb-0">
              <h3 className="fw-bold mb-0">Order History</h3>
            </div>
            <div className="card-body p-4">
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag-x display-4 text-muted mb-3 d-block"></i>
                  <p className="text-muted mb-0">You haven't placed any orders yet.</p>
                  <Link href="/menu" className="btn btn-primary mt-3 rounded-pill px-4">Browse Menu</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Pickup Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr key={order.id}>
                          <td className="fw-bold text-muted">#{order.id.slice(-6).toUpperCase()}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold text-primary">₦{order.total.toLocaleString()}</td>
                          <td>
                            <span className={
                              `badge fw-normal border ` +
                              (order.status === 'PENDING' ? 'bg-light text-secondary border-secondary' : '') +
                              (order.status === 'PREPARING' ? 'bg-warning text-dark border-warning' : '') +
                              (order.status === 'READY_FOR_PICKUP' ? 'bg-primary text-white border-primary' : '') +
                              (order.status === 'DELIVERED' ? 'bg-success text-white border-success' : '')
                            }>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="text-center fw-bold text-monospace" style={{ letterSpacing: '2px' }}>
                            {order.status === 'READY_FOR_PICKUP' ? (
                              <span className="text-success">{order.pickupCode}</span>
                            ) : (
                              <span className="text-muted">---</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
