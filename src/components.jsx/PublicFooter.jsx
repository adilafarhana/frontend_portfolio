import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

const PublicFooter = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const res = await apiClient.get("/api/about");
      if (res.data) {
        const d = res.data;
        const aboutObj = d.data
          ? Array.isArray(d.data)
            ? d.data[0]
            : d.data
          : Array.isArray(d)
          ? d[0]
          : d;
        setAbout(aboutObj);
      }
    } catch (err) {
      console.error("Footer about fetch error:", err);
    }
  };

  const displayName = about?.full_name || "Adila Farhana";
  const displayTitle = about?.professional_title || "Full Stack Developer";

  return (
    <footer className="portix-site-footer">
      <style>{`
        .portix-site-footer {
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          padding: 48px 40px 32px 40px;
          margin-top: 100px;
          color: var(--text-muted);
          font-family: var(--font-main);
        }

        .portix-footer-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .portix-footer-brand-col {
          max-width: 520px;
        }

        .portix-footer-logo {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-pure-white);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .portix-footer-tagline {
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.5;
        }

        .portix-footer-bottom {
          max-width: 1300px;
          margin: 32px auto 0 auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: var(--text-dim);
          flex-wrap: wrap;
          gap: 16px;
        }

        .portix-admin-footer-btn {
          color: var(--accent-orange);
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .portix-admin-footer-btn:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="portix-footer-container">
        <div className="portix-footer-brand-col">
          <div className="portix-footer-logo">{displayName}</div>
          <p className="portix-footer-tagline">
            {displayTitle} — Designing and building robust, scalable web applications with meticulous craftsmanship.
          </p>
        </div>

        <div>
          <Link to="/contact" style={{
            background: "var(--accent-orange)",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>Get In Touch</span>
            <span>➔</span>
          </Link>
        </div>
      </div>

      <div className="portix-footer-bottom">
        <span>© {new Date().getFullYear()} {displayName}. All Rights Reserved.</span>
        <Link to="/admin/login" className="portix-admin-footer-btn">
          <span>⚙️</span>
          <span>Admin Portal</span>
        </Link>
      </div>
    </footer>
  );
};

export default PublicFooter;
