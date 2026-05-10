import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="badge bg-danger text-white mb-3 px-3 py-2 rounded-pill">Fast Delivery 🚀</span>
              <h1 className="display-3 fw-bold">Delicious Food,<br />Delivered To <span className="text-primary">You</span></h1>
              <p className="lead text-muted mb-4">Craving your favorite meal? Order from ChowNow and get it delivered straight to your door or campus in minutes. No hidden fees, just great food.</p>
              <div className="d-flex gap-3">
                <Link href="/menu" className="btn btn-primary btn-lg">Order Now</Link>
                <Link href="#how-it-works" className="btn btn-outline-dark btn-lg rounded-pill px-4">How it works</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="img-fluid rounded-4 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-5 bg-white mt-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">Get your food in 3 simple steps</p>
          </div>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 shadow-sm transition-all hover:-translate-y-2 duration-300">
                <div className="display-4 text-primary mb-3"><i className="bi bi-phone"></i></div>
                <h4 className="fw-bold">1. Choose Food</h4>
                <p className="text-muted">Browse our diverse menu and pick your favorite meals.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 shadow-sm transition-all hover:-translate-y-2 duration-300">
                <div className="display-4 text-primary mb-3"><i className="bi bi-credit-card"></i></div>
                <h4 className="fw-bold">2. Pay Securely</h4>
                <p className="text-muted">Fast checkout using secure Bank Transfer or Card.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-4 bg-light h-100 shadow-sm transition-all hover:-translate-y-2 duration-300">
                <div className="display-4 text-primary mb-3"><i className="bi bi-bicycle"></i></div>
                <h4 className="fw-bold">3. Fast Delivery</h4>
                <p className="text-muted">We deliver your food hot and fresh to your location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
