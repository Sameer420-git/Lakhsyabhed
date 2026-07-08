import { Routes, Route } from 'react-router-dom';
import './App.css'; 
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard   from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/StudentDashboard'; 

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/"      element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* --- Secure Admin Route --- */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* --- Secure Student Route --- */}
      {/* THE FIX: We use the ProtectedRoute as a parent wrapper, just like the Admin route! */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Catch-All 404 Page (Prevents blank screens if you type a wrong URL) */}
      <Route path="*" element={<div style={{ padding: '3rem', color: 'white', textAlign: 'center' }}><h2>404 - Page Not Found</h2><a href="/" style={{color: '#f59e0b'}}>Go Home</a></div>} />
    </Routes>
  );
}

export default App;