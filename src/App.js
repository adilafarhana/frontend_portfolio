import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './utils/ThemeContext';
import AdminLogin from './components.jsx/AdminLogin';
import AdminDashboard from './components.jsx/AdminDashboard';
import AdminProjects from './components.jsx/AdminProjects';
import AdminSkills from './components.jsx/AdminSkills';
import AdminExperience from './components.jsx/AdminExperience';
import AdminEducation from './components.jsx/AdminEducation';
import AdminContact from './components.jsx/AdminContact';
import AdminAbout from './components.jsx/AdminAbout';
import About from './components.jsx/About';
import Skills from './components.jsx/Skills';
import Experience from './components.jsx/Experience';
import Projects from './components.jsx/Projects';
import ProjectDetails from './components.jsx/ProjectDetails';
import Resume from './components.jsx/Resume';
import Contact from './components.jsx/Contact';
import Home from './components.jsx/Home';
import AdminResume from './components.jsx/AdminResume';
import ProtectedRoute from './components.jsx/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Auth Route */}
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
            path="/admin/about"
            element={
              <ProtectedRoute>
                <AdminAbout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <ProtectedRoute>
                <AdminResume />
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

          {/* Admin Shortcuts & Wildcards */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
