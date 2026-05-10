'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderStatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh the server component
        router.refresh();
      } else {
        alert('Failed to update status');
        setStatus(initialStatus);
      }
    } catch (err) {
      alert('Error updating status');
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select 
      className={`form-select form-select-sm shadow-none ${
        status === 'PENDING' ? 'border-secondary blur-bg' :
        status === 'PREPARING' ? 'border-warning' :
        status === 'READY_FOR_PICKUP' ? 'border-primary text-primary fw-bold' :
        status === 'DELIVERED' ? 'border-success' : 'border-danger'
      }`}
      disabled={loading}
      value={status}
      onChange={handleStatusChange}
      style={{ width: '150px', fontWeight: 500 }}
    >
      <option value="PENDING">PENDING</option>
      <option value="PREPARING">PREPARING</option>
      <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
