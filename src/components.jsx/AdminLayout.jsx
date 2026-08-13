import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  FolderGit2,
  Zap,
  Briefcase,
  GraduationCap,
  Mail,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import apiClient from "../utils/apiClient";
import { clearAdminUser, getAdminUser } from "../utils/auth";
import { useTheme } from "../utils/ThemeContext";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/about", label: "About Me", icon: User },
  { path: "/admin/resume", label: "Resume & CV", icon: FileText },
  { path: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { path: "/admin/skills", label: "Skills Stack", icon: Zap },
  { path: "/admin/experience", label: "Experience", icon: Briefcase },
  { path: "/admin/education", label: "Education", icon: GraduationCap },
  { path: "/admin/contact", label: "Inquiries", icon: Mail },
];

const AdminLayout = ({ children, title = "Dashboard" }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAdminUser();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiClient.post("/api/admin/logout");
    } catch (err) {
      console.error("Logout API call error:", err);
    } finally {
      clearAdminUser();
      setLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="portix-admin-shell">
      <style>{`
        .portix-admin-shell {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
          position: relative;
        }

        /* Sidebar Container */
        .admin-editorial-sidebar {
          width: 280px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 1024px) {
          .admin-editorial-sidebar {
            transform: translateX(-100%);
          }
          .admin-editorial-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
          }
        }

        /* Sidebar Brand */
        .admin-sidebar-brand {
          padding: 28px 24px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-brand-logo {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--text-pure-white);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-portal-badge {
          background: rgba(240, 90, 40, 0.12);
          border: 1px solid rgba(240, 90, 40, 0.3);
          color: var(--accent-orange);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Nav List */
        .admin-nav-list {
          flex: 1;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .admin-nav-item:hover {
          color: var(--text-pure-white);
          background: var(--bg-surface-elevated);
          border-color: var(--border-subtle);
        }

        .admin-nav-item.active {
          color: #ffffff;
          background: var(--accent-orange);
          border-color: var(--accent-orange);
          box-shadow: 0 6px 20px rgba(240, 90, 40, 0.35);
        }

        .admin-nav-item.active .admin-nav-icon {
          color: #ffffff;
        }

        .admin-nav-icon {
          color: var(--accent-orange);
          transition: color 0.2s ease;
        }

        /* Sidebar Footer */
        .admin-sidebar-footer {
          padding: 20px 16px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-public-link-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          text-decoration: none;
          color: var(--text-light);
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .admin-public-link-btn:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
        }

        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .admin-logout-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Main Workspace Content Area */
        .admin-main-stage {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        @media (max-width: 1024px) {
          .admin-main-stage {
            margin-left: 0;
          }
        }

        /* Top Header Bar */
        .admin-top-header {
          height: 76px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
          backdrop-filter: blur(16px);
        }

        @media (max-width: 768px) {
          .admin-top-header {
            padding: 0 16px;
          }
        }

        .admin-header-title-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-header-h1 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text-pure-white);
          margin: 0;
        }

        .admin-header-controls {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .admin-theme-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-theme-btn:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          transform: translateY(-1px);
        }

        .admin-user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px 6px 8px;
          border-radius: 30px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
        }

        .admin-avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--accent-orange);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .admin-user-email {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-light);
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .admin-user-email {
            display: none;
          }
        }

        /* Mobile Hamburger */
        .admin-mobile-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-light);
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .admin-mobile-toggle {
            display: flex;
          }
        }

        /* Workspace Content Padding */
        .admin-content-body {
          flex: 1;
          padding: 36px;
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .admin-content-body {
            padding: 20px 16px;
          }
        }

        /* Overlay */
        .admin-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 95;
        }
      `}</style>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-editorial-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <Link to="/admin/dashboard" className="admin-brand-logo">
            <span style={{ color: "var(--accent-orange)" }}>✱</span>
            <span>ADILA</span>
          </Link>
          <span className="admin-portal-badge">PORTAL</span>
        </div>

        <nav className="admin-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} className="admin-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="admin-public-link-btn">
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ExternalLink size={15} style={{ color: "var(--accent-orange)" }} />
              <span>Live Website</span>
            </span>
            <ChevronRight size={14} />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-logout-btn"
          >
            <LogOut size={16} />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <div className="admin-main-stage">
        <header className="admin-top-header">
          <div className="admin-header-title-wrap">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="admin-header-h1">{title}</h1>
          </div>

          <div className="admin-header-controls">
            <button
              onClick={toggleTheme}
              className="admin-theme-btn"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="admin-user-badge">
              <div className="admin-avatar-circle">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
              <span className="admin-user-email">
                {user?.email || "adila@bpract.com"}
              </span>
            </div>
          </div>
        </header>

        <main className="admin-content-body">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
