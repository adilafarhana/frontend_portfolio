import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/skills");
      if (res.data) {
        setSkills(res.data.data || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (err) {
      console.error("Skills API fetch error:", err);
      setError("Failed to load skills data.");
    } finally {
      setLoading(false);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="portix-skills-page">
      <style>{`
        .portix-skills-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-skills-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-skills-container {
            padding: 32px 20px;
          }
        }

        .skills-header-block {
          text-align: center;
          margin-bottom: 56px;
        }

        .skills-tag-pill {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-orange);
          margin-bottom: 8px;
          display: inline-block;
        }

        .skills-h1-title {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 12px;
        }

        .categories-grid-wrap {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 32px;
        }

        .category-editorial-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 36px;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .category-editorial-card:hover {
          border-color: var(--border-light);
          transform: translateY(-4px);
        }

        .category-headline-h2 {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--text-pure-white);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .skill-row-unit {
          margin-bottom: 20px;
        }

        .skill-label-flex {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-pure-white);
          margin-bottom: 8px;
        }

        .skill-progress-base {
          width: 100%;
          height: 6px;
          background: var(--border-subtle);
          border-radius: 6px;
          overflow: hidden;
        }

        .skill-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff5722, #f59e0b);
          border-radius: 6px;
          transition: width 1s ease;
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-skills-container">
        <div className="skills-header-block">
          <span className="skills-tag-pill">■ Core Competencies</span>
          <h1 className="skills-h1-title">Skills & Toolchains</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            A detailed inventory of programming languages, libraries, databases, and DevOps tools in my technical arsenal.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading Skills...</h2>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error}</h2>
          </div>
        ) : Object.keys(skillsByCategory).length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>No skills found.</h2>
          </div>
        ) : (
          <div className="categories-grid-wrap">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className="category-editorial-card">
                <h2 className="category-headline-h2">
                  <span style={{ color: "var(--accent-orange)" }}>■</span>
                  <span>{category}</span>
                </h2>

                {items.map((skill) => (
                  <div key={skill.id} className="skill-row-unit">
                    <div className="skill-label-flex">
                      <span>{skill.name}</span>
                      <span style={{ color: "var(--accent-orange)" }}>
                        {skill.proficiency ? `${skill.proficiency}%` : "Advanced"}
                      </span>
                    </div>
                    <div className="skill-progress-base">
                      <div
                        className="skill-progress-bar-fill"
                        style={{ width: `${skill.proficiency || 85}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default Skills;
