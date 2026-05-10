'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Simple sync for localStorage cart count
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    // Custom event for cart updates within the same window
    window.addEventListener('cartUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white border-bottom shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <i className="bi bi-shop me-2"></i>ChowNow
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link href="/menu" className="nav-link">Menu</Link>
            </li>
            
            {session && (
              <li className="nav-item">
                <Link href="/account" className="nav-link">My Account</Link>
              </li>
            )}
            
            {session?.user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link href="/admin" className="nav-link text-danger fw-bold">Admin</Link>
              </li>
            )}

            {!session ? (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => signOut()}>Logout</button>
              </li>
            )}

            <li className="nav-item ms-lg-3">
              <Link href="/cart" className="btn btn-primary rounded-pill px-4">
                <i className="bi bi-cart3"></i> Cart
                <span className="badge bg-light text-dark ms-2 rounded-circle">{cartCount}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
