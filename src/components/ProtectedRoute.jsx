import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ allowedRole, children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role === allowedRole) setIsAuthorized(true);
      setLoading(false);
    }
    checkAuth();
  }, [allowedRole]);

  // THIS IS THE FIX: A sleek, white background with a modern CSS spinner
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid #f1f5f9', borderTop: '3px solid #0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
         </div>
      </div>
    );
  }

  if (!isAuthorized) return <Navigate to="/login" />;
  
  // Supports both nested <Route> and wrapper children
  return children ? children : <Outlet />;
}