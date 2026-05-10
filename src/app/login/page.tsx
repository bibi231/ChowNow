'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign in with Firebase
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Optional: Get ID Token if needed for back-end verification
      // const idToken = await userCredential.user.getIdToken();

      // 2. Clear out for NextAuth (local session)
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid local account synchronization. Please contact support.');
      } else {
        router.push('/menu');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/menu' });
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="fw-bold text-center mb-4"><i className="bi bi-door-open me-2 text-primary"></i>Welcome Back</h3>
        {error && <div className="alert alert-danger p-2">{error}</div>}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="btn w-100 rounded-pill mb-3 d-flex align-items-center justify-content-center gap-2"
          style={{
            border: '1px solid #dadce0',
            backgroundColor: '#fff',
            color: '#3c4043',
            fontWeight: 500,
            padding: '10px 0',
            fontSize: '0.95rem',
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="d-flex align-items-center mb-3">
          <hr className="flex-grow-1" />
          <span className="px-3 text-muted" style={{ fontSize: '0.85rem' }}>or</span>
          <hr className="flex-grow-1" />
        </div>

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
          <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            Don&apos;t have an account? <Link href="/signup" className="text-decoration-none">Sign up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
