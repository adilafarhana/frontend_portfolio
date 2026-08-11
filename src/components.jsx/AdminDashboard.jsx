import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getAdminUser } from "../utils/auth";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

const AdminDashboard = () => {
  const user = getAdminUser();
  const [counts, setCounts] = useState({
    projects: "4",
    skills: "12",
    experience: "3",
    education: "2",
    contacts: "0",
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [projRes, skillsRes, expRes, eduRes, contactRes] = await Promise.allSettled([
        apiClient.get("/api/admin/projects"),
        apiClient.get("/api/admin/skills"),
        apiClient.get("/api/admin/experience"),
        apiClient.get("/api/admin/education"),
        apiClient.get("/api/admin/contacts"),
      ]);

      const parseCount = (res, defaultVal) => {
        if (res.status === "fulfilled" && res.value?.data) {
          const data = res.value.data.status ? res.value.data.data : res.value.data;
          if (Array.isArray(data)) return String(data.length);
        }
        return defaultVal;
      };

      setCounts({
        projects: parseCount(projRes, "4"),
        skills: parseCount(skillsRes, "12"),
        experience: parseCount(expRes, "3"),
        education: parseCount(eduRes, "2"),
        contacts: parseCount(contactRes, "0"),
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const stats = [
    {
      title: "Projects",
      count: counts.projects,
      icon: "📂",
      path: "/admin/projects",
      color: "linear-gradient(135deg, #a855f7, #6366f1)",
      shadow: "rgba(168, 85, 247, 0.3)",
    },
    {
      title: "Skills",
      count: counts.skills,
      icon: "⚡",
      path: "/admin/skills",
      color: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      shadow: "rgba(59, 130, 246, 0.3)",
    },
    {
      title: "Experience",
      count: counts.experience,
      icon: "💼",
      path: "/admin/experience",
      color: "linear-gradient(135deg, #10b981, #059669)",
      shadow: "rgba(16, 185, 129, 0.3)",
    },
    {
      title: "Education",
      count: counts.education,
      icon: "🎓",
      path: "/admin/education",
      color: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "rgba(245, 158, 11, 0.3)",
    },
    {
      title: "Contact",
      count: counts.contacts,
      icon: "✉️",
      path: "/admin/contact",
      color: "linear-gradient(135deg, #ec4899, #f43f5e)",
      shadow: "rgba(236, 72, 153, 0.3)",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <style>{`
        .dashboard-welcome {
          background: var(--bg-surface);
          border: 1px solid var(--border-glow);
          border-radius: 24px;
          padding: 32px 36px;
          margin-bottom: 36px;
          backdrop-filter: blur(16px);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }

        .dashboard-welcome::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: var(--glow-radial);
          pointer-events: none;
        }

        .welcome-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(168, 85, 247, 0.2);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: var(--accent-purple);
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .dashboard-welcome h2 {
          margin: 0 0 10px 0;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--text-main);
        }

        .dashboard-welcome p {
          margin: 0;
          color: var(--text-muted);
          font-size: 1.02rem;
          line-height: 1.6;
          max-width: 720px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 22px;
          margin-bottom: 36px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 22px;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-card);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-glow);
          box-shadow: var(--shadow-lg);
        }

        .stat-info .stat-title {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .stat-info .stat-count {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          transition: transform 0.3s ease;
          color: #ffffff;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.08);
        }

        .section-box {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 30px 34px;
          box-shadow: var(--shadow-card);
        }

        .section-box h3 {
          margin: 0 0 20px 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .quick-links {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .quick-link-btn {
          padding: 12px 22px;
          border-radius: 14px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quick-link-btn:hover {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
          border-color: var(--border-glow);
          color: var(--text-main);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }
      `}</style>

      <div className="dashboard-welcome">
        <div className="welcome-badge">System Ready</div>
        <h2>Welcome back{user?.name ? `, ${user.name}` : ""}! 👋</h2>
        <p>
          Manage your portfolio projects, tech skills, work history, academic background, and visitor contact submissions seamlessly from one modern workspace.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <Link key={item.title} to={item.path} className="stat-card">
            <div className="stat-info">
              <div className="stat-title">{item.title}</div>
              <div className="stat-count">{item.count}</div>
            </div>
            <div
              className="stat-icon-wrapper"
              style={{ background: item.color, boxShadow: `0 8px 22px ${item.shadow}` }}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-box">
        <h3>Quick Navigation</h3>
        <div className="quick-links">
          <Link to="/admin/projects" className="quick-link-btn">
            <span>📂</span> View Projects
          </Link>
          <Link to="/admin/skills" className="quick-link-btn">
            <span>⚡</span> Manage Skills
          </Link>
          <Link to="/admin/experience" className="quick-link-btn">
            <span>💼</span> Work Experience
          </Link>
          <Link to="/admin/education" className="quick-link-btn">
            <span>🎓</span> Education Records
          </Link>
          <Link to="/admin/contact" className="quick-link-btn">
            <span>✉️</span> Contact Submissions
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
