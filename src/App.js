import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from './components.jsx/AdminLogin';
import AdminDashboard from './components.jsx/AdminDashboard';
import Nav from './components.jsx/Nav';
import About from './components.jsx/About';
import Project from './components.jsx/Project';
import Contact from './components.jsx/Contact';
import Resume from './components.jsx/Resume';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/NAN" element={<Nav />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
