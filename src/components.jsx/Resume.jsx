import React, { useState, useEffect } from "react";
import apiClient, { getMediaUrl } from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveResume();
  }, []);

  const fetchActiveResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/resume");
      if (res.data && res.data.status && res.data.data) {
        setResumeData(res.data.data);
      } else if (res.data && res.data.id) {
        setResumeData(res.data);
      } else if (Array.isArray(res.data) && res.data.length > 0) {
        setResumeData(res.data[0]);
      } else {
        setResumeData(null);
      }
    } catch (err) {
      console.error("Failed to load active resume:", err);
      setError("Unable to load the resume document. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portix-resume-page">
      <style>{`
        .portix-resume-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-resume-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-resume-container {
            padding: 32px 20px;
          }
        }

        .resume-header-editorial-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .resume-header-editorial-card {
            padding: 28px 20px;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .resume-headline-h1 {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 6px;
        }

        .resume-metadata-strip {
          display: flex;
          align-items: center;
          gap: 14px;
          color: var(--text-muted);
          font-size: 0.92rem;
          font-weight: 700;
        }

        .resume-btn-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-portix-download {
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

        .btn-portix-download:hover {
          background: var(--accent-orange-hover);
          transform: translateY(-2px);
        }

        .btn-portix-tab {
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

        .btn-portix-tab:hover {
          border-color: var(--accent-orange);
          background: rgba(249, 115, 22, 0.08);
        }

        .pdf-viewer-editorial-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          height: 820px;
          display: flex;
          flex-direction: column;
        }

        .pdf-top-bar {
          background: var(--bg-surface-elevated);
          padding: 16px 28px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-pure-white);
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-resume-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h2>Loading Resume...</h2>
          </div>
        ) : error || !resumeData ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
            <h2>{error || "No active resume document currently uploaded."}</h2>
          </div>
        ) : (
          <>
            <div className="resume-header-editorial-card">
              <div>
                <h1 className="resume-headline-h1">{resumeData.title || "Curriculum Vitae"}</h1>
                <div className="resume-metadata-strip">
                  <span>📄 {resumeData.file_name || "Resume.pdf"}</span>
                  {resumeData.file_size && <span>• {resumeData.file_size}</span>}
                  <span style={{ color: "var(--accent-orange)" }}>• Verified Active</span>
                </div>
              </div>

              <div className="resume-btn-actions">
                <a
                  href={getMediaUrl(resumeData.file_path)}
                  download
                  className="btn-portix-download"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Download CV</span>
                  <span>📥</span>
                </a>
                <a
                  href={getMediaUrl(resumeData.file_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-portix-tab"
                >
                  <span>Open Tab</span>
                  <span>↗️</span>
                </a>
              </div>
            </div>

            {/* EMBEDDED PDF VIEWER */}
            <div className="pdf-viewer-editorial-box">
              <div className="pdf-top-bar">
                <span>📄 Interactive Document Viewer</span>
                <span>{resumeData.file_name}</span>
              </div>
              <object
                data={getMediaUrl(resumeData.file_path)}
                type="application/pdf"
                style={{ width: "100%", height: "100%", border: "none" }}
              >
                <iframe
                  src={getMediaUrl(resumeData.file_path)}
                  title={resumeData.title}
                  style={{ width: "100%", height: "100%", border: "none" }}
                >
                  <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-pure-white)" }}>
                    <h3>Unable to embed PDF document preview directly</h3>
                    <p style={{ color: "var(--text-muted)", margin: "10px 0 20px 0" }}>
                      Click below to view or download the resume PDF file.
                    </p>
                    <a
                      href={getMediaUrl(resumeData.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-portix-download"
                    >
                      ↗️ Open Resume in New Tab
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default Resume;
