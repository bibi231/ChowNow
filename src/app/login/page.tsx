'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/menu');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="fw-bold text-center mb-4"><i className="bi bi-door-open me-2 text-primary"></i>Welcome Back</h3>
        {error && <div className="alert alert-danger p-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3">Log In</button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account? <Link href="/signup" className="text-decoration-none">Sign up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
