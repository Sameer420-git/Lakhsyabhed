import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png'; 

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Verify credentials via Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Incorrect email or password.');
      setLoading(false);
      return;
    }

    // 2. Fetch secure role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // 3. Route accordingly
    if (profile?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (profile?.role === 'student') {
      navigate('dashboard');
    } else {
      await supabase.auth.signOut();
      setError('Account not configured. Contact the institute.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#071224',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}>
        
        <img src={logo} alt="Institute logo" style={{ height: '45px', marginBottom: '1.5rem', objectFit: 'contain' }} />

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#071224', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '2rem' }}>
          Log in to access your dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#071224', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#f8fafc' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#071224', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#f8fafc' }}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#f59e0b', color: '#071224', padding: '1rem', borderRadius: '8px', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: '0.2s' }}
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
          Contact the administration office if you are having trouble logging in.
        </p>
      </div>
    </div>
  );
}