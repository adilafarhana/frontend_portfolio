import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/api/projects/${slug}`);
      if (res.data && res.data.data) {
        setProject(res.data.data);
      } else if (res.data && res.data.id) {
        setProject(res.data);
      } else {
        setError("Project details not found.");
      }
    } catch (err) {
      console.error("Project details fetch error:", err);
      setError("Unable to find or load the requested project.");
    } finally {
      setLoading(false);
    }
  };

  const techs = project
    ? Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
      ? project.technologies.split(",").map((t) => t.trim())
      : []
    : [];

  return (
    <div className="portix-detail-page">
      <style>{`
        .portix-detail-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-detail-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-detail-container {
            padding: 32px 20px;
          }
        }

        .back-link-wrapper {
          margin-bottom: 32px;
        }

        .btn-back-works {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s ease;
        }

        .btn-back-works:hover {
          color: var(--accent-orange);
        }

        .detail-editorial-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 48px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .detail-editorial-card {
            padding: 28px 20px;
          }
        }

        .detail-banner-element {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: 20px;
          margin-bottom: 40px;
          border: 1px solid var(--border-light);
        }

        .detail-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .detail-title-h1 {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 8px;
        }

        .detail-buttons-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-portix-cta-orange {
          background: var(--accent-orange);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
        }

        .btn-portix-cta-orange:hover {
          background: var(--accent-orange-hover);
          transform: translateY(-2px);
        }

        .btn-portix-cta-dark {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-pure-white);
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-portix-cta-dark:hover {
          border-color: var(--accent-orange);
          background: rgba(249, 115, 22, 0.08);
        }

        .detail-section-title {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin: 36px 0 16px 0;
        }

        .detail-body-text {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.8;
        }

        .tech-pill-editorial {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-pure-white);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 8px;
          margin-right: 10px;
          margin-bottom: 10px;
          display: inline-block;
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-detail-container">
        <div className="back-link-wrapper">
          <Link to="/projects" className="btn-back-works">
            <span>←</span>
            <span>Back to All Works</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading Project Details...</h2>
          </div>
        ) : error || !project ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error || "Project not found"}</h2>
            <Link to="/projects" style={{ color: "var(--accent-orange)", marginTop: "16px", display: "inline-block" }}>
              ← Return to Works
            </Link>
          </div>
        ) : (
          <div className="detail-editorial-card">
            {project.project_image && (
              <img
                src={getMediaUrl(project.project_image)}
                alt={project.title}
                className="detail-banner-element"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="detail-header-flex">
              <div>
                <h1 className="detail-title-h1">{project.title}</h1>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  {project.featured && (
                    <span style={{ background: "var(--accent-orange)", color: "#ffffff", padding: "4px 10px", borderRadius: "6px", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase" }}>
                      ★ Featured Work
                    </span>
                  )}
                  <span style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", fontSize: "0.75rem", textTransform: "uppercase" }}>
                    Status: {project.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="detail-buttons-row">
                {project.live_demo_url && (
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-portix-cta-orange"
                  >
                    <span>🚀</span>
                    <span>Live Demo</span>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-portix-cta-dark"
                  >
                    <span>🐙</span>
                    <span>GitHub Code</span>
                  </a>
                )}
              </div>
            </div>

            <h2 className="detail-section-title">Case Study Overview</h2>
            <p className="detail-body-text">{project.description}</p>

            {techs.length > 0 && (
              <>
                <h2 className="detail-section-title">Technologies Used</h2>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {techs.map((tech, idx) => (
                    <span key={idx} className="tech-pill-editorial">
                      ⚡ {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default ProjectDetails;
