import { Routes, Route } from 'react-router-dom';
import './App.css'; //
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard  from './pages/admin/Dashboard';
import StudentCourses  from './pages/portal/Courses';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"      element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Secure Admin Route */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/dashboard" element={<StudentDashboard />} />
      {/* Secure Student Route */}
      <Route path="/portal" element={<ProtectedRoute allowedRole="student" />}>
        <Route path="courses" element={<StudentCourses />} />
      </Route>
    </Routes>
  );
}

export default App;