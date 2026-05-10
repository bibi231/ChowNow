import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero pt-5 mt-5 pb-5 bg-body-tertiary">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="badge bg-danger text-white mb-3 px-3 py-2 rounded-pill shadow-sm">Fast Delivery 🚀</span>
              <h1 className="display-3 fw-bold mb-3 text-body">Delicious Food,<br />Delivered To <span className="text-primary">You</span></h1>
              <p className="lead text-body-secondary mb-4">Craving your favorite meal? Order from ChowNow and get it delivered straight to your door or campus in minutes. No hidden fees, just great food.</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/menu" className="btn btn-primary btn-lg rounded-pill px-4 shadow">Order Now</Link>
                <Link href="#how-it-works" className="btn btn-outline-secondary btn-lg rounded-pill px-4">How it works</Link>
              </div>
            </div>
            <div className="col-lg-6">
               <div className="position-relative">
                  <img src="/hero-food.png" alt="Delicious Food" className="img-fluid rounded-4 shadow-lg w-100" style={{ objectFit: 'cover', height: '450px' }} />
                  <div className="position-absolute bottom-0 start-0 translate-middle-y ms-4 p-3 bg-body border rounded-4 shadow">
                     <div className="d-flex align-items-center gap-3">
                        <div className="bg-success rounded-circle p-2 text-white"><i className="bi bi-clock-history"></i></div>
                        <div>
                           <h6 className="mb-0 fw-bold">Live Tracking</h6>
                           <small className="text-body-secondary">Delivery under 30 mins</small>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-5 bg-body">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase tracking-wide">Simple Process</span>
            <h2 className="fw-bold display-5 mt-2">How It Works</h2>
            <p className="text-body-secondary">Get your food in 3 simple steps</p>
          </div>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-5 border-0 rounded-4 bg-body-tertiary h-100 shadow-sm transition-all text-center">
                <div className="display-4 text-primary mb-4"><i className="bi bi-phone"></i></div>
                <h4 className="fw-bold">1. Choose Food</h4>
                <p className="text-body-secondary">Browse our diverse menu and pick your favorite meals.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-5 border-0 rounded-4 bg-body-tertiary h-100 shadow-sm transition-all text-center">
                <div className="display-4 text-primary mb-4"><i className="bi bi-credit-card"></i></div>
                <h4 className="fw-bold">2. Pay Securely</h4>
                <p className="text-body-secondary">Fast checkout using secure Bank Transfer or Card.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-5 border-0 rounded-4 bg-body-tertiary h-100 shadow-sm transition-all text-center">
                <div className="display-4 text-primary mb-4"><i className="bi bi-bicycle"></i></div>
                <h4 className="fw-bold">3. Fast Delivery</h4>
                <p className="text-body-secondary">We deliver your food hot and fresh to your location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
