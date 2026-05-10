export default function TermsOfService() {
  return (
    <div className="container py-5 mt-5 bg-body rounded-4 shadow-sm" style={{ minHeight: '70vh' }}>
      <h2 className="fw-bold mb-4">Terms of Service</h2>
      <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h4 className="mt-4">1. Acceptance of Terms</h4>
      <p>By accessing and using ChowNow, you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h4 className="mt-4">2. Description of Service</h4>
      <p>ChowNow provides users with access to a rich collection of resources, including various food ordering capabilities and delivery logistics. You understand and agree that the Service is provided "AS-IS" and that ChowNow assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user orders beyond reasonable efforts.</p>

      <h4 className="mt-4">3. User Conduct</h4>
      <p>You agree not to use the Service for any unlawful purpose or in any way that might harm, damage, or disparage any other party. Abuse of the pickup code system or fraudulent orders will result in immediate termination of your account.</p>
    </div>
  );
}
