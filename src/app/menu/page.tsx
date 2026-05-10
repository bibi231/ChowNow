'use client';

import { useState } from 'react';
import menuData from '@/../public/assets/data/menu.json';
import Image from 'next/image';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(menuData.map(item => item.category)))];

  const filteredMenu = activeCategory === "All" 
    ? menuData 
    : menuData.filter(item => item.category === activeCategory);

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((c: any) => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="container py-5 mt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-5">Our Menu</h2>
        <p className="text-muted">Explore our wide variety of delicious meals</p>
        
        {/* Category Filter */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`btn rounded-pill px-4 ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {filteredMenu.map((item) => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden menu-card transition-all hover:-translate-y-1 duration-300">
              <div 
                style={{
                  height: '200px', 
                  backgroundImage: `url(${item.image.startsWith('http') ? item.image : `/${item.image}`})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center'
                }}
              >
              </div>
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold mb-0 text-truncate" title={item.name}>{item.name}</h5>
                </div>
                <div className="mb-2">
                  <span className="badge bg-light text-dark border">{item.category}</span>
                  <span className="ms-2 text-warning"><i className="bi bi-star-fill"></i> {item.rating}</span>
                </div>
                <h4 className="text-primary fw-bold mt-auto mb-3">₦{item.price.toLocaleString()}</h4>
                <button 
                  className="btn btn-outline-primary w-100 rounded-pill mt-auto" 
                  onClick={() => addToCart(item)}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
