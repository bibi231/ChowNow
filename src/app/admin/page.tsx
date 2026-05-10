import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import OrderStatusSelect from './OrderStatusSelect';

export const revalidate = 0; // Disable static caching for admin

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const allOrders = await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o: any) => o.status === 'PENDING').length;
  const deliveredOrders = allOrders.filter((o: any) => o.status === 'DELIVERED').length;

  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '50px' }}>
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold mb-3"><i className="bi bi-speedometer2 text-danger"></i> Admin Dashboard</h2>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="text-muted fw-bold text-uppercase">Total Orders</h6>
                  <h2 className="fw-black mb-0">{totalOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="text-muted fw-bold text-uppercase">Pending</h6>
                  <h2 className="fw-black text-warning mb-0">{pendingOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="text-muted fw-bold text-uppercase">Delivered</h6>
                  <h2 className="fw-black text-success mb-0">{deliveredOrders}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Recent Orders</h4>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Code</th>
                  <th>Action / Status</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No orders found in the system.</td></tr>
                ) : (
                  allOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="fw-bold text-muted">#{order.id.slice(-8).toUpperCase()}</td>
                      <td>
                        <div className="fw-bold">{order.user.name}</div>
                        <small className="text-muted">{order.user.email}</small>
                        <br/>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</small>
                      </td>
                      <td style={{ maxWidth: '200px' }} className="text-truncate">
                        {(order.items as any[]).map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
                      </td>
                      <td className="fw-bold text-primary">₦{order.total.toLocaleString()}</td>
                      <td><span className="badge bg-light text-dark border">{order.paymentMethod}</span></td>
                      <td className="font-monospace fw-bold">{order.pickupCode}</td>
                      <td>
                        <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
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
  );
}
