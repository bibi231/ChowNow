import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container py-5 mt-4" style={{ minHeight: '75vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-10 text-center mb-5">
          <span className="badge bg-primary text-white rounded-pill px-3 py-2 mb-3 fw-medium">Our Story</span>
          <h1 className="fw-bolder display-4 mb-4">Redefining Food Delivery</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            ChowNow was born out of a simple idea: good food should be easy to get. We connect local food lovers with the best restaurants in town through a seamless, fast, and transparent platform.
          </p>
        </div>
      </div>

      <div className="row g-5 align-items-center mb-5 pb-4">
        <div className="col-lg-6">
          <div className="position-relative rounded-4 overflow-hidden shadow-lg" style={{ height: '400px', backgroundColor: '#e9ecef' }}>
            {/* Placeholder Image container */}
            <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-dark text-white">
               <i className="bi bi-shop display-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Fresh ingredients, direct to you.</h2>
          <p className="mb-4 text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            We started locally, partnering with family-owned restaurants that needed a better way to reach their customers. Today, our advanced platform allows users to order effortlessly, track their food in real-time, and pick it up with our secure code system.
          </p>
          <ul className="list-unstyled mb-4">
            <li className="d-flex mb-3 align-items-center">
              <i className="bi bi-check-circle-fill text-primary fs-4 me-3"></i>
              <span className="fs-5 fw-medium">Curated Local Restaurants</span>
            </li>
            <li className="d-flex mb-3 align-items-center">
              <i className="bi bi-check-circle-fill text-primary fs-4 me-3"></i>
              <span className="fs-5 fw-medium">Secure Payment & Pickup Codes</span>
            </li>
            <li className="d-flex mb-3 align-items-center">
              <i className="bi bi-check-circle-fill text-primary fs-4 me-3"></i>
              <span className="fs-5 fw-medium">Real-time Order Updates</span>
            </li>
          </ul>
          <Link href="/menu" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
            Explore Menu <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>

      <div className="bg-body-tertiary rounded-4 p-5 text-center mt-5">
        <h3 className="fw-bold mb-3">Want to partner with us?</h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
          We are always looking for amazing local restaurants to join our platform. Expand your reach and increase your sales seamlessly.
        </p>
        <button className="btn btn-outline-dark btn-lg rounded-pill px-4">Contact Sales</button>
      </div>
    </div>
  );
}
