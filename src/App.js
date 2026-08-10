import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from './components.jsx/AdminLogin';
import AdminDashboard from './components.jsx/AdminDashboard';
import AdminProjects from './components.jsx/AdminProjects';
import AdminSkills from './components.jsx/AdminSkills';
import AdminExperience from './components.jsx/AdminExperience';
import AdminEducation from './components.jsx/AdminEducation';
import AdminContact from './components.jsx/AdminContact';
import ProtectedRoute from './components.jsx/ProtectedRoute';
import Nav from './components.jsx/Nav';
import About from './components.jsx/About';
import Project from './components.jsx/Project';
import Contact from './components.jsx/Contact';
import Resume from './components.jsx/Resume';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin auth route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminSkills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <AdminExperience />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/education"
          element={
            <ProtectedRoute>
              <AdminEducation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminContact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute>
              <AdminContact />
            </ProtectedRoute>
          }
        />

        {/* Redirect legacy /login and /dashboard to /admin/* */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Public portfolio routes */}
        <Route path="/NAN" element={<Nav />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />

        {/* Root → admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
