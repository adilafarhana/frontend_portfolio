import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import { useTheme } from "../utils/ThemeContext";

const PublicNavbar = () => {
  const [about, setAbout] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const res = await apiClient.get("/api/about");
      if (res.data) {
        const d = res.data;
        const aboutObj = d.data
          ? Array.isArray(d.data)
            ? d.data[0]
            : d.data
          : Array.isArray(d)
          ? d[0]
          : d;
        setAbout(aboutObj);
      }
    } catch (err) {
      console.error("Navbar about fetch error:", err);
    }
  };

  const displayName = about?.full_name || "Adila Farhana";
  const brandName = displayName.split(" ")[0].toUpperCase() || "PORTIX";
  const displayAvatar = about?.profile_image
    ? getMediaUrl(about.profile_image)
    : "/profile.jpg";

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="portix-navbar-header">
      <style>{`
        .portix-navbar-header {
          position: sticky;
          top: 0;
          width: 100%;
          background: rgba(13, 17, 23, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 999;
          backdrop-filter: blur(20px);
          padding: 20px 40px;
          transition: all 0.3s ease;
          font-family: var(--font-main);
        }

        .portix-nav-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .portix-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-pure-white);
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .portix-brand-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-orange);
          background: var(--bg-surface-elevated);
        }

        .portix-nav-menu {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        @media (max-width: 980px) {
          .portix-nav-menu {
            display: none;
          }
        }

        .portix-nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          position: relative;
          padding: 4px 0;
        }

        .portix-nav-link:hover,
        .portix-nav-link.active {
          color: var(--text-pure-white);
        }

        .portix-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-orange);
        }

        .portix-talk-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 4px 16px 4px 4px;
          color: var(--text-pure-white);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .portix-talk-btn:hover {
          border-color: var(--accent-orange);
          background: rgba(249, 115, 22, 0.08);
          transform: translateY(-2px);
        }

        .portix-talk-arrow {
          width: 32px;
          height: 32px;
          background: var(--accent-orange);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-weight: 900;
          transition: transform 0.25s ease;
        }

        .portix-talk-btn:hover .portix-talk-arrow {
          transform: translateX(3px);
          background: var(--accent-orange-hover);
        }

        .portix-admin-pill {
          color: var(--text-dim);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px dashed var(--border-light);
          transition: all 0.2s ease;
        }

        .portix-admin-pill:hover {
          color: var(--text-pure-white);
          border-color: var(--accent-orange);
          background: rgba(249, 115, 22, 0.08);
        }

        .portix-theme-toggle {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-pure-white);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          transition: all 0.2s ease;
        }

        .portix-theme-toggle:hover {
          border-color: var(--accent-orange);
          transform: rotate(15deg);
        }

        .portix-mobile-toggle-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-pure-white);
          font-size: 1.6rem;
          cursor: pointer;
        }

        @media (max-width: 980px) {
          .portix-mobile-toggle-btn {
            display: block;
          }
        }

        .portix-mobile-nav-drawer {
          position: fixed;
          top: 76px;
          left: 0;
          right: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 999;
          backdrop-filter: blur(20px);
        }
      `}</style>

      <div className="portix-nav-container">
        <Link to="/" className="portix-brand-logo">
          <img
            src={displayAvatar}
            alt={displayName}
            className="portix-brand-badge"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/profile.jpg";
            }}
          />
          <span>{brandName}</span>
        </Link>

        <nav className="portix-nav-menu">
          <Link to="/" className={`portix-nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/projects" className={`portix-nav-link ${isActive("/projects") ? "active" : ""}`}>
            Works
          </Link>
          <Link to="/about" className={`portix-nav-link ${isActive("/about") ? "active" : ""}`}>
            About
          </Link>
          <Link to="/skills" className={`portix-nav-link ${isActive("/skills") ? "active" : ""}`}>
            Skills
          </Link>
          <Link to="/experience" className={`portix-nav-link ${isActive("/experience") ? "active" : ""}`}>
            Experience
          </Link>
          <Link to="/resume" className={`portix-nav-link ${isActive("/resume") ? "active" : ""}`}>
            Resume
          </Link>

          <Link to="/contact" className="portix-talk-btn">
            <span className="portix-talk-arrow">→</span>
            <span>Let's Talk</span>
          </Link>

          <Link to="/admin/login" className="portix-admin-pill" title="Admin Portal">
            ⚙️ Admin
          </Link>

          <button
            onClick={toggleTheme}
            className="portix-theme-toggle"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>

        <button
          className="portix-mobile-toggle-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="portix-mobile-nav-drawer">
          <Link to="/" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            Home
          </Link>
          <Link to="/projects" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            Works
          </Link>
          <Link to="/about" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            About
          </Link>
          <Link to="/skills" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            Skills
          </Link>
          <Link to="/experience" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            Experience
          </Link>
          <Link to="/resume" className="portix-nav-link" onClick={() => setMobileNavOpen(false)}>
            Resume
          </Link>
          <Link to="/contact" className="portix-talk-btn" style={{ justifyContent: "center" }} onClick={() => setMobileNavOpen(false)}>
            <span className="portix-talk-arrow">→</span>
            <span>Let's Talk</span>
          </Link>
          <Link to="/admin/login" className="portix-admin-pill" style={{ textAlign: "center" }} onClick={() => setMobileNavOpen(false)}>
            ⚙️ Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
