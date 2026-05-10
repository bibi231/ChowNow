import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3"><i className="bi bi-shop me-2"></i>ChowNow</h5>
            <p className="text-secondary">
              Delicious Food, Delivered To You. 
              Craving your favorite meal? Order from ChowNow and get it delivered straight to your door or campus in minutes.
            </p>
          </div>
          <div className="col-lg-2 offset-lg-2">
            <h5 className="fw-bold mb-3">Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li className="mb-2"><Link href="/menu" className="text-secondary text-decoration-none hover-white">Menu</Link></li>
              <li className="mb-2"><Link href="/cart" className="text-secondary text-decoration-none hover-white">Cart</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3">Legal & Policies</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/privacy-policy" className="text-secondary text-decoration-none hover-white">Privacy Policy</Link></li>
              <li className="mb-2"><Link href="/terms-of-service" className="text-secondary text-decoration-none hover-white">Terms of Service</Link></li>
              <li className="mb-2"><Link href="/refund-policy" className="text-secondary text-decoration-none hover-white">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <hr className="my-4 border-secondary" />
        <div className="text-center text-secondary">
          <p className="mb-0">&copy; {new Date().getFullYear()} ChowNow Restaurant System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
