'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check initial theme from local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-bs-theme', storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cartUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom shadow-sm fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold text-primary">
          <i className="bi bi-shop me-2"></i>ChowNow
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item">
              <Link href="/about" className="nav-link text-body fw-medium">About</Link>
            </li>
            <li className="nav-item">
              <Link href="/menu" className="nav-link text-body fw-medium">Menu</Link>
            </li>
            
            {status !== 'loading' && session && (
              <li className="nav-item">
                <Link href="/account" className="nav-link text-body fw-medium">My Account</Link>
              </li>
            )}
            
            {status !== 'loading' && session?.user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link href="/admin" className="nav-link text-danger fw-bold"><i className="bi bi-shield-lock me-1"></i> Admin</Link>
              </li>
            )}

            {status !== 'loading' && !session ? (
              <>
                <li className="nav-item ms-lg-2">
                  <Link href="/login" className="btn btn-outline-primary rounded-pill px-3 me-2">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup" className="btn btn-primary rounded-pill px-3">Sign Up</Link>
                </li>
              </>
            ) : status !== 'loading' && session ? (
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-danger rounded-pill px-3" onClick={() => signOut()}>Logout</button>
              </li>
            ) : null}

            <li className="nav-item ms-lg-3 my-2 my-lg-0">
              <Link href="/cart" className="btn btn-primary rounded-pill px-4 position-relative">
                <i className="bi bi-cart3"></i> Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                  {cartCount}
                  <span className="visually-hidden">items in cart</span>
                </span>
              </Link>
            </li>

            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <button 
                onClick={toggleTheme} 
                className="btn btn-light rounded-circle shadow-sm border" 
                style={{ width: '40px', height: '40px' }}
                title="Toggle Dark Mode"
              >
                <i className={`bi ${theme === 'dark' ? 'bi-moon-stars-fill text-warning' : 'bi-sun-fill text-warning'}`}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
