export default function PrivacyPolicy() {
  return (
    <div className="container py-5 mt-5 bg-body rounded-4 shadow-sm" style={{ minHeight: '70vh' }}>
      <h2 className="fw-bold mb-4">Privacy Policy</h2>
      <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h4 className="mt-4">1. Information We Collect</h4>
      <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>

      <h4 className="mt-4">2. Use of Information</h4>
      <p>We may use the information we collect about you to Provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.</p>

      <h4 className="mt-4">3. Security</h4>
      <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
    </div>
  );
}
