import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expRes, eduRes] = await Promise.allSettled([
        apiClient.get("/api/experience"),
        apiClient.get("/api/education"),
      ]);

      if (expRes.status === "fulfilled" && expRes.value.data) {
        setExperiences(expRes.value.data.data || (Array.isArray(expRes.value.data) ? expRes.value.data : []));
      }

      if (eduRes.status === "fulfilled" && eduRes.value.data) {
        setEducations(eduRes.value.data.data || (Array.isArray(eduRes.value.data) ? eduRes.value.data : []));
      }
    } catch (err) {
      console.error("Experience API fetch error:", err);
      setError("Failed to load experience and education data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portix-experience-page">
      <style>{`
        .portix-experience-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-experience-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-experience-container {
            padding: 32px 20px;
          }
        }

        .experience-header-editorial {
          text-align: center;
          margin-bottom: 56px;
        }

        .experience-eyebrow {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-orange);
          margin-bottom: 8px;
        }

        .experience-big-headline {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 12px;
        }

        .timeline-two-col-portix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .timeline-two-col-portix {
            grid-template-columns: 1fr;
          }
        }

        .timeline-panel-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 44px;
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .timeline-panel-card {
            padding: 28px 20px;
          }
        }

        .panel-headline-title {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .timeline-bullet-node {
          position: relative;
          padding-left: 32px;
          border-left: 2px solid var(--border-light);
          margin-bottom: 40px;
        }

        .timeline-bullet-node:last-child {
          margin-bottom: 0;
        }

        .timeline-bullet-dot {
          position: absolute;
          left: -8px;
          top: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent-orange);
          box-shadow: 0 0 12px var(--accent-orange);
        }

        .timeline-dates-tag {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--accent-orange);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .timeline-role-h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-pure-white);
          margin-bottom: 4px;
        }

        .timeline-company-name {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 12px;
        }

        .timeline-desc-p {
          font-size: 0.92rem;
          color: var(--text-dim);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .tech-pill-badge {
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
      `}</style>

      <PublicNavbar />

      <main className="portix-experience-container">
        <div className="experience-header-editorial">
          <div className="experience-eyebrow">■ Career Trajectory</div>
          <h1 className="experience-big-headline">Experience & Education</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            A chronological timeline of my backend development roles, company projects, and formal academic foundation.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading Timeline...</h2>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error}</h2>
          </div>
        ) : (
          <div className="timeline-two-col-portix">
            {/* WORK EXPERIENCE */}
            <div className="timeline-panel-card">
              <h2 className="panel-headline-title">
                <span style={{ color: "var(--accent-orange)" }}>■</span>
                <span>Work Experience</span>
              </h2>

              {experiences.length > 0 ? (
                experiences.map((exp) => {
                  const techs = Array.isArray(exp.technologies)
                    ? exp.technologies
                    : typeof exp.technologies === "string"
                    ? exp.technologies.split(",").map((t) => t.trim())
                    : [];

                  return (
                    <div key={exp.id} className="timeline-bullet-node">
                      <div className="timeline-bullet-dot" />
                      <div className="timeline-dates-tag">
                        {exp.start_date || "Present"} — {exp.is_current_job ? "Current" : exp.end_date || "Present"}
                      </div>
                      <h3 className="timeline-role-h3">{exp.position}</h3>
                      <div className="timeline-company-name">{exp.company}</div>
                      <p className="timeline-desc-p">{exp.description}</p>

                      {techs.length > 0 && (
                        <div>
                          {techs.map((tech, idx) => (
                            <span key={idx} className="tech-pill-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "var(--text-muted)" }}>No work experience records found.</p>
              )}
            </div>

            {/* EDUCATION */}
            <div className="timeline-panel-card">
              <h2 className="panel-headline-title">
                <span style={{ color: "var(--accent-orange)" }}>■</span>
                <span>Academic Education</span>
              </h2>

              {educations.length > 0 ? (
                educations.map((edu) => (
                  <div key={edu.id} className="timeline-bullet-node">
                    <div className="timeline-bullet-dot" />
                    <div className="timeline-dates-tag">
                      {edu.start_year} — {edu.end_year || "Present"}
                    </div>
                    <h3 className="timeline-role-h3">{edu.degree}</h3>
                    <div className="timeline-company-name">{edu.institution}</div>
                    {edu.description && (
                      <p className="timeline-desc-p">{edu.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)" }}>No academic education records found.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default Experience;
