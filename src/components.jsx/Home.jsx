import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Home = () => {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [aboutRes, projRes, skillsRes, expRes, resumeRes] =
        await Promise.allSettled([
          apiClient.get("/api/about"),
          apiClient.get("/api/projects"),
          apiClient.get("/api/skills"),
          apiClient.get("/api/experience"),
          apiClient.get("/api/resume"),
        ]);

      if (aboutRes.status === "fulfilled" && aboutRes.value.data) {
        const d = aboutRes.value.data;
        const aboutObj = d.data
          ? Array.isArray(d.data)
            ? d.data[0]
            : d.data
          : Array.isArray(d)
          ? d[0]
          : d;
        setAbout(aboutObj);
      }

      if (projRes.status === "fulfilled" && projRes.value.data) {
        const d = projRes.value.data;
        setProjects(d.data || (Array.isArray(d) ? d : []));
      }

      if (skillsRes.status === "fulfilled" && skillsRes.value.data) {
        const d = skillsRes.value.data;
        setSkills(d.data || (Array.isArray(d) ? d : []));
      }

      if (expRes.status === "fulfilled" && expRes.value.data) {
        const d = expRes.value.data;
        setExperiences(d.data || (Array.isArray(d) ? d : []));
      }

      if (resumeRes.status === "fulfilled" && resumeRes.value.data) {
        const d = resumeRes.value.data;
        setResume(d.data || d);
      }
    } catch (err) {
      console.error("Home data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = about?.full_name || "Adila Farhana";
  const displayTitle = about?.professional_title || "Full-Stack Developer";
  const displayIntro =
    about?.short_intro ||
    about?.description ||
    "Full Stack Developer specializing in responsive frontend architectures, robust backend APIs, and modern web applications.";
  const displayAvatar = about?.profile_image
    ? getMediaUrl(about.profile_image)
    : "";

  const featuredProjects = projects.slice(0, 3);
  const topSkills = skills.slice(0, 8);

  const getSlug = (project) => {
    if (!project) return "project";
    return (
      project.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || project.id
    );
  };

  return (
    <div className="portix-home-view">
      <style>{`
        .portix-home-view {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
          position: relative;
          overflow-x: hidden;
        }

        /* Top Loading Line */
        .top-loading-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff5722, #f59e0b);
          z-index: 9999;
        }

        /* Ambient Glow behind Hero Disc */
        .hero-ambient-disc {
          position: absolute;
          top: 80px;
          right: 15%;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.35) 0%, rgba(234, 88, 12, 0.05) 60%, transparent 80%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
        }

        .home-main-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px 40px 80px 40px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .home-main-container {
            padding: 24px 20px;
          }
        }

        /* HERO SECTION */
        .hero-portix-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          min-height: 600px;
          position: relative;
          margin-bottom: 60px;
        }

        @media (max-width: 1024px) {
          .hero-portix-layout {
            flex-direction: column-reverse;
            text-align: center;
            min-height: auto;
            gap: 32px;
          }
        }

        .hero-left-editorial {
          flex: 1.2;
          max-width: 680px;
          z-index: 2;
        }

        .hero-eyebrow-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-orange);
          margin-bottom: 16px;
        }

        .hero-eyebrow-tag::before {
          content: '■';
          font-size: 0.75rem;
        }

        .hero-editorial-headline {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .hero-editorial-headline {
            font-size: 2.8rem;
          }
        }

        .hero-bio-summary {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 540px;
        }

        @media (max-width: 1024px) {
          .hero-bio-summary {
            margin: 0 auto 32px auto;
          }
        }

        .hero-action-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .hero-action-buttons {
            justify-content: center;
          }
        }

        .btn-inkyy-orange {
          background: var(--accent-orange);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.4);
        }

        .btn-inkyy-orange:hover {
          background: var(--accent-orange-hover);
          transform: translateY(-3px);
          box-shadow: 0 14px 35px rgba(234, 88, 12, 0.6);
        }

        .btn-inkyy-outline {
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-pure-white);
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .btn-inkyy-outline:hover {
          border-color: var(--text-pure-white);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-3px);
        }

        /* Hero Right Portrait Frame */
        .hero-right-portrait {
          flex: 0.9;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-disc-circle {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ea580c 0%, #7c2d12 60%, transparent 100%);
          z-index: -1;
          box-shadow: 0 0 80px rgba(234, 88, 12, 0.3);
        }

        @media (max-width: 768px) {
          .hero-disc-circle {
            width: 280px;
            height: 280px;
          }
        }

        .hero-portrait-img-wrap {
          width: 360px;
          height: 420px;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .hero-portrait-img-wrap {
            width: 260px;
            height: 320px;
          }
        }

        .hero-portrait-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
        }

        /* Floating Stamp Button */
        .hero-stamp-badge {
          position: absolute;
          bottom: -20px;
          left: -20px;
          width: 100px;
          height: 100px;
          background: var(--accent-orange);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffffff;
          font-weight: 900;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 10px 25px rgba(234, 88, 12, 0.5);
          text-decoration: none;
          line-height: 1.2;
          transition: transform 0.3s ease;
          border: 2px solid var(--bg-primary);
        }

        .hero-stamp-badge:hover {
          transform: scale(1.1) rotate(6deg);
          background: var(--accent-orange-hover);
        }

        /* STATS COUNTER STRIP */
        .inkyy-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 90px;
          margin-top: 40px;
        }

        @media (max-width: 860px) {
          .inkyy-stats-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-block-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .stat-block-card:hover {
          border-color: var(--accent-orange);
          transform: translateY(-4px);
        }

        .stat-large-number {
          font-size: 2.4rem;
          font-weight: 900;
          color: var(--text-pure-white);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .stat-label-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* SECTION STYLING */
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          margin-top: 80px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .section-tag-upper {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--accent-orange);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .section-title-bold {
          font-size: 2.4rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
        }

        .link-view-more {
          color: var(--text-pure-white);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s ease;
        }

        .link-view-more:hover {
          color: var(--accent-orange);
        }

        /* Projects Grid */
        .portix-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 32px;
        }

        .portix-project-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .portix-project-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-light);
          box-shadow: var(--shadow-lg);
        }

        .portix-project-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: var(--bg-surface-elevated);
          transition: transform 0.4s ease;
        }

        .portix-project-card:hover .portix-project-img {
          transform: scale(1.04);
        }

        .portix-project-body {
          padding: 26px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .portix-project-title {
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: var(--text-pure-white);
        }

        .portix-project-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .portix-project-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-orange);
        }

        /* Skills Chips */
        .portix-skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .portix-skill-badge {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 14px 24px;
          border-radius: 12px;
          color: var(--text-pure-white);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
        }

        .portix-skill-badge:hover {
          border-color: var(--accent-orange);
          transform: translateY(-2px);
          color: var(--accent-orange);
        }

        /* Experience Timeline */
        .portix-exp-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .portix-exp-card:hover {
          border-color: var(--border-light);
        }

        /* CTA Banner */
        .portix-cta-banner {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 28px;
          padding: 56px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 90px;
          box-shadow: var(--shadow-lg);
          flex-wrap: wrap;
          gap: 32px;
        }
      `}</style>

      {loading && <div className="top-loading-bar" />}
      <div className="hero-ambient-disc" />

      {/* Global Navbar */}
      <PublicNavbar />

      <main className="home-main-container">
        {/* 1. HERO SECTION */}
        <section className="hero-portix-layout">
          <div className="hero-left-editorial">
            <div className="hero-eyebrow-tag">
              <span>{displayTitle}</span>
            </div>

            <h1 className="hero-editorial-headline">
              <span>DESIGN</span> <span className="text-outline">THAT</span><br />
              <span>CONVERTS VISITORS</span><br />
              <span className="text-outline">INTO USERS</span>
            </h1>

            <p className="hero-bio-summary">{displayIntro}</p>

            <div className="hero-action-buttons">
              {resume ? (
                <a
                  href={getMediaUrl(resume.file_path)}
                  download
                  className="btn-inkyy-orange"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Download CV</span>
                  <span>📥</span>
                </a>
              ) : (
                <Link to="/contact" className="btn-inkyy-orange">
                  <span>Get In Touch</span>
                  <span>➔</span>
                </Link>
              )}

              <Link to="/projects" className="btn-inkyy-outline">
                <span>My Works</span>
              </Link>
            </div>
          </div>

          <div className="hero-right-portrait">
            <div className="hero-disc-circle" />

            <div className="hero-portrait-img-wrap">
              <img
                src={displayAvatar}
                alt={displayName}
                className="hero-portrait-element"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg?nii=t";
                }}
              />

              <Link to="/contact" className="hero-stamp-badge">
                <span>Hire Me<br />Now</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. STATS COUNTER STRIP */}
        <section className="inkyy-stats-strip">
          <div className="stat-block-card">
            <div className="stat-large-number">{about?.years_experience || "1+"}</div>
            <div className="stat-label-text">Experience</div>
          </div>
          <div className="stat-block-card">
            <div className="stat-large-number">{projects.length || "3"}+</div>
            <div className="stat-label-text">Projects Built</div>
          </div>
          <div className="stat-block-card">
            <div className="stat-large-number">{skills.length || "8"}+</div>
            <div className="stat-label-text">Core Technologies</div>
          </div>
          <div className="stat-block-card">
            <div className="stat-large-number" style={{ color: "var(--accent-orange)" }}>100%</div>
            <div className="stat-label-text">Available Now</div>
          </div>
        </section>

        {/* 3. FEATURED WORKS SHOWCASE */}
        <section>
          <div className="section-header-row">
            <div>
              <div className="section-tag-upper">Portfolio</div>
              <h2 className="section-title-bold">Selected Works</h2>
            </div>
            <Link to="/projects" className="link-view-more">
              <span>View All Works</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="portix-projects-grid">
            {featuredProjects.map((project) => (
              <Link
                to={`/projects/${getSlug(project)}`}
                key={project.id}
                className="portix-project-card"
              >
                {project.project_image ? (
                  <img
                    src={getMediaUrl(project.project_image)}
                    alt={project.title}
                    className="portix-project-img"
                  />
                ) : (
                  <div
                    style={{
                      height: "220px",
                      background: "var(--bg-surface-elevated)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    💻
                  </div>
                )}

                <div className="portix-project-body">
                  <h3 className="portix-project-title">{project.title}</h3>
                  <p className="portix-project-desc">{project.description}</p>
                  <div className="portix-project-footer">
                    <span>Explore Case Study</span>
                    <span>➔</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. TECHNICAL SKILLS SUMMARY */}
        <section>
          <div className="section-header-row">
            <div>
              <div className="section-tag-upper">Tech Stack</div>
              <h2 className="section-title-bold">Skills & Tools</h2>
            </div>
            <Link to="/skills" className="link-view-more">
              <span>Explore All Stack</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="portix-skills-grid">
            {topSkills.map((s) => (
              <div key={s.id} className="portix-skill-badge">
                <span style={{ color: "var(--accent-orange)" }}>⚡</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CAREER TIMELINE */}
        <section>
          <div className="section-header-row">
            <div>
              <div className="section-tag-upper">Experience</div>
              <h2 className="section-title-bold">Career Journey</h2>
            </div>
            <Link to="/experience" className="link-view-more">
              <span>Full Timeline</span>
              <span>➔</span>
            </Link>
          </div>

          <div>
            {experiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="portix-exp-card">
                <div style={{ color: "var(--accent-orange)", fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                  {exp.start_date} — {exp.is_current_job ? "Current" : exp.end_date || "Present"}
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "4px", color: "var(--text-pure-white)" }}>{exp.position}</h3>
                <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "700", marginBottom: "10px" }}>{exp.company}</div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: "1.7" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION BANNER */}
        <section className="portix-cta-banner">
          <div>
            <div className="section-tag-upper">Collaboration</div>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-pure-white)" }}>
              Have a project in mind?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
              Let’s build scalable and memorable digital experiences together.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/contact" className="btn-inkyy-orange">
              <span>Let's Talk</span>
              <span>➔</span>
            </Link>
            <Link to="/about" className="btn-inkyy-outline">
              <span>About Me</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <PublicFooter />
    </div>
  );
};

export default Home;
