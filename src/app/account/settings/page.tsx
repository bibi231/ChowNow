import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

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
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold">{user.name}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="list-group list-group-flush rounded-4 overflow-hidden">
              <Link href="/account" className="list-group-item list-group-item-action py-3 fw-medium text-muted">
                <i className="bi bi-bag me-2"></i> My Orders
              </Link>
              <Link href="/account/settings" className="list-group-item list-group-item-action active py-3 fw-medium">
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 p-4 pb-0">
              <h3 className="fw-bold mb-0">Account Settings</h3>
            </div>
            <div className="card-body p-4">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Full Name</label>
                    <input type="text" className="form-control bg-light" defaultValue={user.name} readOnly />
                    <small className="text-muted mt-1 d-block">Contact support to change your name.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Email Address</label>
                    <input type="email" className="form-control bg-light" defaultValue={user.email} readOnly />
                  </div>
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold">Security</h5>
                    <hr/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Role</label>
                    <input type="text" className="form-control bg-light" defaultValue={user.role} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Account Created</label>
                    <input type="text" className="form-control bg-light" defaultValue={new Date(user.createdAt).toLocaleDateString()} readOnly />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
