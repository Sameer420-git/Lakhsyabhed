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
      {/* Accessible at /admin/dashboard */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* --- Secure Student Route --- */}
      {/* Accessible at /dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;