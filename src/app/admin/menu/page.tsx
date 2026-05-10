'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Rice');
  const [image, setImage] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/menu');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
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
    fetchItems();
  }, [session, status, router]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, category, image })
      });
      if (res.ok) {
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        // Reload list
        fetchItems();
      } else {
        alert('Failed to add item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="container py-5 mt-5 text-center h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 mt-4 bg-body-tertiary min-vh-100">
      <div className="row mb-4 px-lg-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bolder mb-0"><i className="bi bi-list-columns-reverse me-2 text-primary"></i>Menu Management</h2>
            <p className="text-body-secondary mb-0">Add or remove items directly from the database.</p>
          </div>
          <div className="d-flex gap-2">
             <Link href="/admin" className="btn btn-outline-secondary shadow-sm">
               <i className="bi bi-display me-2"></i>KDS
             </Link>
             <button className="btn btn-light shadow-sm border" onClick={fetchItems}>
               <i className="bi bi-arrow-clockwise me-2"></i>Refresh
             </button>
          </div>
        </div>
      </div>

      <div className="row px-lg-4 g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-transparent pt-4 pb-0 border-0">
               <h5 className="fw-bold">Add New Item</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddItem}>
                <div className="mb-3">
                  <label className="form-label text-body-secondary small fw-bold">Name</label>
                  <input type="text" className="form-control bg-body" value={name} onChange={r => setName(r.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-body-secondary small fw-bold">Description</label>
                  <textarea className="form-control bg-body" value={description} onChange={r => setDescription(r.target.value)} required rows={2} />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label text-body-secondary small fw-bold">Price (₦)</label>
                    <input type="number" className="form-control bg-body" value={price} onChange={r => setPrice(r.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-body-secondary small fw-bold">Category</label>
                    <select className="form-select bg-body" value={category} onChange={r => setCategory(r.target.value)}>
                      <option>Rice</option>
                      <option>Pasta</option>
                      <option>Snacks</option>
                      <option>Drinks</option>
                      <option>Soup</option>
                      <option>Combo</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label text-body-secondary small fw-bold">Image URL</label>
                  <input type="text" className="form-control bg-body" placeholder="https://..." value={image} onChange={r => setImage(r.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill">Add Item to Database</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
           <div className="card shadow-sm border-0 rounded-4">
             <div className="card-body p-0">
               <div className="table-responsive">
                 <table className="table table-hover align-middle mb-0">
                   <thead className="table-light">
                     <tr>
                       <th className="ps-4">Image</th>
                       <th>Item Details</th>
                       <th>Category</th>
                       <th>Price</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {items.length === 0 ? (
                       <tr><td colSpan={5} className="text-center py-4 text-muted">No items in the database. Did you seed?</td></tr>
                     ) : (
                       items.map(item => (
                         <tr key={item.id}>
                           <td className="ps-4">
                             <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} className="img-thumbnail rounded" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                           </td>
                           <td>
                             <h6 className="fw-bold mb-0">{item.name}</h6>
                             <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{item.description}</small>
                           </td>
                           <td><span className="badge bg-secondary">{item.category}</span></td>
                           <td className="fw-bold">₦{item.price.toLocaleString()}</td>
                           <td>
                              <span className={`badge ${item.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                                {item.isAvailable ? 'Active' : 'Disabled'}
                              </span>
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
