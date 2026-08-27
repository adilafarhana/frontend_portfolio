import React, { useState, useEffect } from "react";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutDetails();
  }, []);

  const fetchAboutDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/about");
      if (res.data) {
        const d = res.data;
        let aboutObj = d.data
          ? Array.isArray(d.data)
            ? d.data[0]
            : d.data
          : Array.isArray(d)
          ? d[0]
          : d;

        if (aboutObj && aboutObj.highlights && typeof aboutObj.highlights === "string") {
          try {
            aboutObj.highlights = JSON.parse(aboutObj.highlights);
          } catch {
            aboutObj.highlights = aboutObj.highlights
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }
        setAboutData(aboutObj);
      }
    } catch (err) {
      console.error("About API fetch error:", err);
      setError("Failed to load about profile data.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = aboutData?.full_name || "Adila Farhana";
  const displayTitle = aboutData?.professional_title || "Full-Stack Developer";
  const displayAvatar = aboutData?.profile_image
    ? getMediaUrl(aboutData.profile_image)
    : "https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg?nii=t";

  return (
    <div className="portix-about-page">
      <style>{`
        .portix-about-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-about-container {
            padding: 32px 20px;
          }
        }

        .about-hero-editorial {
          display: flex;
          align-items: center;
          gap: 48px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 48px;
          margin-bottom: 48px;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 900px) {
          .about-hero-editorial {
            flex-direction: column;
            text-align: center;
            padding: 32px 20px;
          }
        }

        .about-portrait-frame {
          width: 240px;
          height: 280px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid var(--border-light);
          position: relative;
        }

        .about-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-editorial-headline {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 8px;
        }

        .about-tagline {
          font-size: 1.15rem;
          color: var(--accent-orange);
          font-weight: 800;
          margin-bottom: 16px;
        }

        .about-intro-quote {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.7;
          font-style: italic;
        }

        .about-meta-chips {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .about-meta-pill {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-pure-white);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .about-card-block {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }

        .about-block-title {
          font-size: 1.4rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-pure-white);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .about-block-desc {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.8;
        }

        .highlights-chips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .highlight-chip-item {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          padding: 16px 20px;
          border-radius: 12px;
          color: var(--text-pure-white);
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: border-color 0.2s ease;
        }

        .highlight-chip-item:hover {
          border-color: var(--accent-orange);
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-about-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading About Information...</h2>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error}</h2>
          </div>
        ) : (
          <>
            {/* HERO ABOUT PROFILE */}
            <div className="about-hero-editorial">
              <div className="about-portrait-frame">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="about-portrait-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ color: "var(--accent-orange)", fontWeight: "800", fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                  ■ Personal Profile
                </div>
                <h1 className="about-editorial-headline">{displayName}</h1>
                <div className="about-tagline">{displayTitle}</div>

                {aboutData?.short_intro && (
                  <p className="about-intro-quote">"{aboutData.short_intro}"</p>
                )}

                <div className="about-meta-chips">
                  {aboutData?.location && (
                    <div className="about-meta-pill">📍 {aboutData.location}</div>
                  )}
                  {aboutData?.years_experience && (
                    <div className="about-meta-pill">⏱️ {aboutData.years_experience} Experience</div>
                  )}
                  <div className="about-meta-pill" style={{ color: "var(--accent-orange)", borderColor: "var(--accent-orange)" }}>
                    🟢 Open for Opportunities
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILED BIO STORY */}
            {aboutData?.description && (
              <div className="about-card-block">
                <h2 className="about-block-title">
                  <span style={{ color: "var(--accent-orange)" }}>■</span>
                  <span>My Story & Professional Philosophy</span>
                </h2>
                <p className="about-block-desc">{aboutData.description}</p>
              </div>
            )}

            {/* CAREER & EDUCATION SUMMARIES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "32px" }}>
              {aboutData?.career_summary && (
                <div className="about-card-block" style={{ margin: 0 }}>
                  <h3 className="about-block-title">
                    <span style={{ color: "var(--accent-orange)" }}>■</span>
                    <span>Career Summary</span>
                  </h3>
                  <p className="about-block-desc">{aboutData.career_summary}</p>
                </div>
              )}

              {aboutData?.education_summary && (
                <div className="about-card-block" style={{ margin: 0 }}>
                  <h3 className="about-block-title">
                    <span style={{ color: "var(--accent-orange)" }}>■</span>
                    <span>Academic Summary</span>
                  </h3>
                  <p className="about-block-desc">{aboutData.education_summary}</p>
                </div>
              )}
            </div>

            {/* KEY HIGHLIGHTS */}
            {aboutData?.highlights && Array.isArray(aboutData.highlights) && aboutData.highlights.length > 0 && (
              <div className="about-card-block">
                <h2 className="about-block-title">
                  <span style={{ color: "var(--accent-orange)" }}>■</span>
                  <span>Core Highlights & Capabilities</span>
                </h2>
                <div className="highlights-chips-grid">
                  {aboutData.highlights.map((hl, idx) => (
                    <div key={idx} className="highlight-chip-item">
                      <span style={{ color: "var(--accent-orange)" }}>✔</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default About;
