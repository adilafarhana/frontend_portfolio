import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { clearAdminUser, getAdminUser } from "../utils/auth";
import { useTheme } from "../utils/ThemeContext";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/admin/about", label: "About", icon: "👤" },
  { path: "/admin/resume", label: "Resume", icon: "📄" },
  { path: "/admin/projects", label: "Projects", icon: "📂" },
  { path: "/admin/skills", label: "Skills", icon: "⚡" },
  { path: "/admin/experience", label: "Experience", icon: "💼" },
  { path: "/admin/education", label: "Education", icon: "🎓" },
  { path: "/admin/contact", label: "Contact", icon: "✉️" },
];

const AdminLayout = ({ children, title = "Admin Panel" }) => {
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
    <div className="admin-layout">
      <style>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
          color: var(--text-main);
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          position: relative;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Ambient Glow Mesh Background */
        .admin-layout::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: var(--glow-radial);
          pointer-events: none;
          z-index: 0;
        }

        .admin-layout::after {
          content: '';
          position: fixed;
          bottom: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: var(--glow-radial-secondary);
          pointer-events: none;
          z-index: 0;
        }

        /* Sidebar Styles */
        .admin-sidebar {
          width: 270px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease;
          backdrop-filter: blur(16px);
        }

        .sidebar-brand {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #ffffff;
          font-size: 1.25rem;
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }

        .sidebar-menu {
          flex: 1;
          padding: 22px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 18px;
          border-radius: 14px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          color: var(--text-main);
          background: rgba(168, 85, 247, 0.08);
          transform: translateX(4px);
        }

        .nav-item.active {
          color: var(--text-main);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(59, 130, 246, 0.18));
          border: 1px solid var(--border-glow);
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.18);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .sidebar-footer {
          padding: 18px 14px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        }

        .user-details {
          overflow: hidden;
        }

        .user-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #dc2626;
          border-color: rgba(239, 68, 68, 0.45);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
        }

        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Main Content Area */
        .admin-main {
          flex: 1;
          margin-left: 270px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          z-index: 10;
        }

        .admin-header {
          padding: 22px 36px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-surface);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 90;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .header-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--text-main);
          margin: 0;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-theme-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .admin-theme-btn:hover {
          border-color: var(--accent-purple);
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 1.3rem;
          padding: 6px 12px;
          border-radius: 10px;
          cursor: pointer;
        }

        .admin-body {
          flex: 1;
          padding: 36px;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0;
          }

          .mobile-toggle {
            display: block;
          }

          .admin-header {
            padding: 18px 20px;
          }

          .admin-body {
            padding: 20px;
          }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">A</div>
          <span className="brand-title">Portfolio Admin</span>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                <img
                  src="/profile.jpg"
                  alt="Admin"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="user-details">
                <div className="user-name">{user.name || "Admin"}</div>
                <div className="user-email">{user.email || ""}</div>
              </div>
            </div>
          )}

          <button
            className="logout-btn"
            id="admin-sidebar-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            🚪 {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="header-title">{title}</h1>
          <div className="admin-header-actions">
            <button
              onClick={toggleTheme}
              className="admin-theme-btn"
              title="Toggle Light/Dark Theme"
            >
              <span>{theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </header>

        <main className="admin-body">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
