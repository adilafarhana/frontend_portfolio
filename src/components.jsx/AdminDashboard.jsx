import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderGit2,
  Zap,
  Briefcase,
  GraduationCap,
  Mail,
  Sparkles,
  ExternalLink,
  Plus,
  User,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { getAdminUser } from "../utils/auth";
import apiClient from "../utils/apiClient";

const AdminDashboard = () => {
  const user = getAdminUser();
  const [counts, setCounts] = useState({
    projects: "3",
    skills: "8",
    experience: "2",
    education: "2",
    contacts: "0",
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [projRes, skillsRes, expRes, eduRes, contactRes] =
        await Promise.allSettled([
          apiClient.get("/api/admin/projects"),
          apiClient.get("/api/admin/skills"),
          apiClient.get("/api/admin/experience"),
          apiClient.get("/api/admin/education"),
          apiClient.get("/api/admin/contacts"),
        ]);

      const parseCount = (res, defaultVal) => {
        if (res.status === "fulfilled" && res.value?.data) {
          const data = res.value.data.status
            ? res.value.data.data
            : res.value.data;
          if (Array.isArray(data)) return String(data.length);
        }
        return defaultVal;
      };

      setCounts({
        projects: parseCount(projRes, "3"),
        skills: parseCount(skillsRes, "8"),
        experience: parseCount(expRes, "2"),
        education: parseCount(eduRes, "2"),
        contacts: parseCount(contactRes, "0"),
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const statCards = [
    {
      title: "Backend Projects",
      count: counts.projects,
      icon: FolderGit2,
      path: "/admin/projects",
      badge: "LIVE WORKS",
      color: "var(--accent-orange)",
    },
    {
      title: "Skills & Stack",
      count: counts.skills,
      icon: Zap,
      path: "/admin/skills",
      badge: "TECH ARSENAL",
      color: "#3b82f6",
    },
    {
      title: "Work Experience",
      count: counts.experience,
      icon: Briefcase,
      path: "/admin/experience",
      badge: "COMPANIES",
      color: "#10b981",
    },
    {
      title: "Education",
      count: counts.education,
      icon: GraduationCap,
      path: "/admin/education",
      badge: "ACADEMIC",
      color: "#f59e0b",
    },
    {
      title: "Contact Messages",
      count: counts.contacts,
      icon: Mail,
      path: "/admin/contact",
      badge: "INBOX",
      color: "#ec4899",
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <style>{`
        .dash-overview-wrap {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Hero Welcome Banner */
        .dash-welcome-card {
          background: var(--hero-terracotta-gradient);
          border-radius: 24px;
          padding: 40px 48px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 16px 40px rgba(234, 88, 12, 0.25);
          position: relative;
          overflow: hidden;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .dash-welcome-text h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .dash-welcome-text p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 540px;
          line-height: 1.6;
        }

        .dash-banner-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .dash-btn-white {
          background: #ffffff;
          color: #09090b;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 22px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: all 0.2s ease;
        }

        .dash-btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .dash-btn-glass {
          background: rgba(18, 18, 22, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 22px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .dash-btn-glass:hover {
          background: rgba(18, 18, 22, 0.85);
          transform: translateY(-2px);
        }

        /* Metric Cards Grid */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 20px;
        }

        .dash-stat-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          color: var(--text-light);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .dash-stat-box:hover {
          border-color: var(--accent-orange);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .dash-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .dash-stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-orange);
        }

        .dash-stat-badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .dash-stat-count {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--text-pure-white);
          line-height: 1;
          margin-bottom: 6px;
        }

        .dash-stat-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        /* Lower Grid: Quick Management & System Status */
        .dash-bottom-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dash-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        .dash-panel-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }

        .dash-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .dash-panel-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: var(--text-pure-white);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Quick Action Tiles */
        .dash-quick-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (max-width: 640px) {
          .dash-quick-links-grid {
            grid-template-columns: 1fr;
          }
        }

        .dash-quick-tile {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 16px;
          text-decoration: none;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.2s ease;
        }

        .dash-quick-tile:hover {
          border-color: var(--accent-orange);
          transform: translateY(-2px);
        }

        .dash-quick-tile-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(240, 90, 40, 0.12);
          border: 1px solid rgba(240, 90, 40, 0.25);
          color: var(--accent-orange);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dash-quick-tile-text h4 {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-pure-white);
          margin-bottom: 2px;
        }

        .dash-quick-tile-text p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        /* System Info List */
        .dash-sys-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dash-sys-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          font-size: 0.85rem;
        }

        .dash-sys-label {
          color: var(--text-muted);
          font-weight: 600;
        }

        .dash-sys-val {
          font-weight: 800;
          color: var(--text-pure-white);
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <div className="dash-overview-wrap">
        {/* Welcome Card */}
        <motion.div
          className="dash-welcome-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="dash-welcome-text">
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: "800",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "6px",
                opacity: 0.9,
              }}
            >
              ✱ BACKEND CONTROL CENTER
            </div>
            <h2>WELCOME BACK, {user?.name?.split(" ")[0]?.toUpperCase() || "ADILA"}</h2>
            <p>
              Manage your backend portfolio content, project case studies, API skills stack, resume documents, and client inquiries from one central hub.
            </p>
          </div>

          <div className="dash-banner-actions">
            <Link to="/admin/projects" className="dash-btn-white">
              <Plus size={16} />
              <span>Add Project</span>
            </Link>
            <Link to="/" target="_blank" className="dash-btn-glass">
              <ExternalLink size={16} />
              <span>View Live Site</span>
            </Link>
          </div>
        </motion.div>

        {/* Metric Cards Grid */}
        <div className="dash-stats-grid">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link to={stat.path} className="dash-stat-box">
                  <div className="dash-stat-top">
                    <div className="dash-stat-icon-wrap">
                      <Icon size={20} />
                    </div>
                    <span className="dash-stat-badge">{stat.badge}</span>
                  </div>

                  <div>
                    <div className="dash-stat-count">{stat.count}</div>
                    <div className="dash-stat-title">{stat.title}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Lower Dashboard Sections */}
        <div className="dash-bottom-grid">
          {/* Quick Content Navigation */}
          <div className="dash-panel-card">
            <div className="dash-panel-header">
              <div className="dash-panel-title">
                <Sparkles size={18} style={{ color: "var(--accent-orange)" }} />
                <span>Quick Portfolio Actions</span>
              </div>
            </div>

            <div className="dash-quick-links-grid">
              <Link to="/admin/about" className="dash-quick-tile">
                <div className="dash-quick-tile-icon">
                  <User size={18} />
                </div>
                <div className="dash-quick-tile-text">
                  <h4>Edit Profile & Bio</h4>
                  <p>Update headline & summary</p>
                </div>
              </Link>

              <Link to="/admin/projects" className="dash-quick-tile">
                <div className="dash-quick-tile-icon">
                  <FolderGit2 size={18} />
                </div>
                <div className="dash-quick-tile-text">
                  <h4>Manage Projects</h4>
                  <p>Add case studies & tags</p>
                </div>
              </Link>

              <Link to="/admin/skills" className="dash-quick-tile">
                <div className="dash-quick-tile-icon">
                  <Zap size={18} />
                </div>
                <div className="dash-quick-tile-text">
                  <h4>Tech Stack</h4>
                  <p>Laravel, Node, MySQL</p>
                </div>
              </Link>

              <Link to="/admin/resume" className="dash-quick-tile">
                <div className="dash-quick-tile-icon">
                  <FileText size={18} />
                </div>
                <div className="dash-quick-tile-text">
                  <h4>Upload Resume</h4>
                  <p>Manage PDF & CV preview</p>
                </div>
              </Link>
            </div>
          </div>

          {/* System & API Status */}
          <div className="dash-panel-card">
            <div className="dash-panel-header">
              <div className="dash-panel-title">
                <Activity size={18} style={{ color: "var(--accent-orange)" }} />
                <span>API & Environment</span>
              </div>
            </div>

            <div className="dash-sys-list">
              <div className="dash-sys-item">
                <span className="dash-sys-label">API Gateway</span>
                <span className="dash-sys-val">
                  <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                  <span style={{ color: "#10b981" }}>Connected</span>
                </span>
              </div>

              <div className="dash-sys-item">
                <span className="dash-sys-label">Primary Role</span>
                <span className="dash-sys-val">Backend Developer</span>
              </div>

              <div className="dash-sys-item">
                <span className="dash-sys-label">Active Stack</span>
                <span className="dash-sys-val">Laravel + React</span>
              </div>

              <div className="dash-sys-item">
                <span className="dash-sys-label">Database</span>
                <span className="dash-sys-val">MySQL / Eloquent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
