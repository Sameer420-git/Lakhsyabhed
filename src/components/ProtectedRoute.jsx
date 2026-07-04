import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ allowedRole }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'denied'

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setStatus('denied');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === allowedRole) {
        setStatus('ok');
      } else {
        setStatus('denied');
      }
    }
    check();
  }, [allowedRole]);

  if (status === 'loading') return <div style={{ color: 'white', padding: '2rem' }}>Authenticating...</div>;
  if (status === 'denied')  return <Navigate to="/login" replace />;
  return <Outlet />;
}