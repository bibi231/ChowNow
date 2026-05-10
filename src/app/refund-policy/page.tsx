export default function RefundPolicy() {
  return (
    <div className="container py-5 mt-5 bg-white rounded-4 shadow-sm" style={{ minHeight: '70vh' }}>
      <h2 className="fw-bold mb-4">Refund Policy</h2>
      <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h4 className="mt-4">1. General Refund Rules</h4>
      <p>Our refunds are evaluated on a case-by-case basis. If there is a problem with your order, please contact the restaurant or our support team immediately.</p>

      <h4 className="mt-4">2. Missing or Incorrect Items</h4>
      <p>If parts of your order were missing or incorrect, we will issue a partial or full refund for the affected items. We may require photographic evidence to process the refund.</p>

      <h4 className="mt-4">3. Cancellation</h4>
      <p>You may cancel your order for a full refund up until the restaurant accepts the order and transitions it to the 'Preparing' status. Cancellations after this point may not be eligible for a refund since the food preparation process has begun.</p>
    </div>
  );
}
