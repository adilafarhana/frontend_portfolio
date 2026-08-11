import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/projects");
      if (res.data) {
        setProjects(res.data.data || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load project records.");
    } finally {
      setLoading(false);
    }
  };

  const getSlug = (project) => {
    if (!project) return "project";
    return (
      project.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || project.id
    );
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "featured") return Boolean(p.featured);
    const techs = Array.isArray(p.technologies)
      ? p.technologies.join(" ").toLowerCase()
      : (p.technologies || "").toLowerCase();
    return techs.includes(filter.toLowerCase());
  });

  return (
    <div className="portix-projects-page">
      <style>{`
        .portix-projects-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-projects-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-projects-container {
            padding: 32px 20px;
          }
        }

        .projects-header-editorial {
          text-align: center;
          margin-bottom: 48px;
        }

        .projects-eyebrow {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-orange);
          margin-bottom: 8px;
        }

        .projects-big-headline {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 12px;
        }

        .filter-buttons-strip {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .btn-filter-tag {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-filter-tag.active,
        .btn-filter-tag:hover {
          background: var(--text-pure-white);
          color: var(--bg-primary);
          border-color: var(--text-pure-white);
        }

        .portix-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 36px;
        }

        @media (max-width: 640px) {
          .portix-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .project-editorial-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .project-editorial-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-light);
          box-shadow: var(--shadow-lg);
        }

        .project-thumbnail-wrap {
          width: 100%;
          height: 240px;
          background: var(--bg-surface-elevated);
          position: relative;
          overflow: hidden;
        }

        .project-thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .project-editorial-card:hover .project-thumbnail-img {
          transform: scale(1.05);
        }

        .project-card-body-section {
          padding: 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .project-item-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: var(--text-pure-white);
        }

        .project-item-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tech-tag-chip {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-pure-white);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          margin-right: 6px;
          margin-bottom: 6px;
          display: inline-block;
        }

        .project-action-bar {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .link-explore-details {
          color: var(--accent-orange);
          text-decoration: none;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .link-explore-details:hover {
          text-decoration: underline;
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-projects-container">
        <div className="projects-header-editorial">
          <div className="projects-eyebrow">■ Selected Works</div>
          <h1 className="projects-big-headline">Engineering Projects</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            A curated portfolio of scalable web applications, API microservices, and interactive client experiences.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-buttons-strip">
          <button
            className={`btn-filter-tag ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Works ({projects.length})
          </button>
          <button
            className={`btn-filter-tag ${filter === "featured" ? "active" : ""}`}
            onClick={() => setFilter("featured")}
          >
            ★ Featured
          </button>
          <button
            className={`btn-filter-tag ${filter === "mern" ? "active" : ""}`}
            onClick={() => setFilter("mern")}
          >
            MERN Stack
          </button>
          <button
            className={`btn-filter-tag ${filter === "laravel" ? "active" : ""}`}
            onClick={() => setFilter("laravel")}
          >
            Laravel
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading Works...</h2>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error}</h2>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>No projects found under this filter.</h2>
          </div>
        ) : (
          <div className="portix-grid-layout">
            {filteredProjects.map((project) => {
              const techs = Array.isArray(project.technologies)
                ? project.technologies
                : typeof project.technologies === "string"
                ? project.technologies.split(",").map((t) => t.trim())
                : [];
              const slug = getSlug(project);

              return (
                <div key={project.id} className="project-editorial-card">
                  <Link to={`/projects/${slug}`} className="project-thumbnail-wrap">
                    {project.project_image ? (
                      <img
                        src={getMediaUrl(project.project_image)}
                        alt={project.title}
                        className="project-thumbnail-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "3rem",
                        }}
                      >
                        💻
                      </div>
                    )}

                    {project.featured && (
                      <div style={{ position: "absolute", top: "14px", left: "14px", background: "var(--accent-orange)", color: "#ffffff", fontWeight: "900", fontSize: "0.75rem", padding: "4px 12px", borderRadius: "6px", textTransform: "uppercase" }}>
                        ★ Featured
                      </div>
                    )}
                  </Link>

                  <div className="project-card-body-section">
                    <Link to={`/projects/${slug}`} style={{ textDecoration: "none" }}>
                      <h2 className="project-item-title">{project.title}</h2>
                    </Link>
                    <p className="project-item-desc">{project.description}</p>

                    <div style={{ marginBottom: "18px" }}>
                      {techs.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="tech-tag-chip">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-action-bar">
                      <Link to={`/projects/${slug}`} className="link-explore-details">
                        <span>Explore Case Study</span>
                        <span>➔</span>
                      </Link>

                      <div style={{ display: "flex", gap: "12px" }}>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "1.15rem" }}
                            title="GitHub"
                          >
                            🐙
                          </a>
                        )}
                        {project.live_demo_url && (
                          <a
                            href={project.live_demo_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--accent-orange)", textDecoration: "none", fontSize: "1.15rem" }}
                            title="Live Demo"
                          >
                            🚀
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default Projects;
