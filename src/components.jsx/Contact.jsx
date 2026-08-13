import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const Contact = () => {
  const [about, setAbout] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
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
      console.error("Contact details fetch error:", err);
    }
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post("/api/contact", formData);
      showToast("success", "Your message has been sent successfully! I will respond promptly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact submit error:", err);
      showToast(
        "error",
        err.response?.data?.message || "Failed to send message. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portix-contact-page">
      <style>{`
        .portix-contact-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
        }

        .portix-contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .portix-contact-container {
            padding: 32px 20px;
          }
        }

        .contact-header-editorial {
          text-align: center;
          margin-bottom: 56px;
        }

        .contact-eyebrow {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-orange);
          margin-bottom: 8px;
        }

        .contact-big-headline {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 12px;
        }

        .contact-two-col-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .contact-two-col-layout {
            grid-template-columns: 1fr;
          }
        }

        .contact-info-editorial-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 44px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .contact-info-editorial-panel {
            padding: 28px 20px;
          }
        }

        .contact-entry-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .contact-icon-box-dark {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          flex-shrink: 0;
        }

        .contact-entry-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }

        .contact-entry-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-pure-white);
          word-break: break-all;
        }

        .social-strip-btns {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .social-btn-dark {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-pure-white);
          padding: 12px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
        }

        .social-btn-dark:hover {
          background: var(--accent-orange);
          color: #ffffff;
          border-color: var(--accent-orange);
        }

        .contact-form-editorial-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 28px;
          padding: 44px;
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .contact-form-editorial-panel {
            padding: 28px 20px;
          }
        }

        .form-grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 600px) {
          .form-grid-2-col {
            grid-template-columns: 1fr;
          }
        }

        .form-group-item {
          margin-bottom: 22px;
        }

        .label-portix-text {
          display: block;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 8px;
        }

        .input-portix-field,
        .textarea-portix-field {
          width: 100%;
          padding: 16px 20px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 10px;
          color: var(--text-pure-white);
          font-size: 0.95rem;
          outline: none;
          font-family: inherit;
          transition: all 0.25s ease;
        }

        .input-portix-field:focus,
        .textarea-portix-field:focus {
          border-color: var(--accent-orange);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.25);
        }

        .btn-portix-send-message {
          background: var(--accent-orange);
          color: #ffffff;
          font-weight: 900;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.35);
        }

        .btn-portix-send-message:hover {
          background: var(--accent-orange-hover);
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(234, 88, 12, 0.55);
        }

        .toast-portix-alert {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.92rem;
          z-index: 2000;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toast-portix-success {
          background: #059669;
          border: 1px solid #10b981;
        }

        .toast-portix-error {
          background: #dc2626;
          border: 1px solid #ef4444;
        }
      `}</style>

      <PublicNavbar />

      <main className="portix-contact-container">
        <div className="contact-header-editorial">
          <div className="contact-eyebrow">■ Start a Conversation</div>
          <h1 className="contact-big-headline">Let's Connect</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            Have a project opportunity, software inquiry, or consulting request? Reach out directly.
          </p>
        </div>

        <div className="contact-two-col-layout">
          {/* Info Panel */}
          <div className="contact-info-editorial-panel">
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-pure-white)" }}>
                Direct Channels
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.7" }}>
                Available for full-time backend developer roles, freelance projects, and web development consultations.
              </p>
            </div>

            <div className="contact-entry-row">
              <div className="contact-icon-box-dark">📍</div>
              <div>
                <div className="contact-entry-label">Location</div>
                <div className="contact-entry-val">{about?.location || "Calicut, Kerala (Open to Remote)"}</div>
              </div>
            </div>

            <div className="contact-entry-row">
              <div className="contact-icon-box-dark">✉️</div>
              <div>
                <div className="contact-entry-label">Direct Email</div>
                <div className="contact-entry-val">adila@gmail.com</div>
              </div>
            </div>

            <div className="contact-entry-row">
              <div className="contact-icon-box-dark">💼</div>
              <div>
                <div className="contact-entry-label">Availability</div>
                <div className="contact-entry-val" style={{ color: "var(--accent-orange)" }}>
                  🟢 Available Immediately
                </div>
              </div>
            </div>

            <div>
              <div className="contact-entry-label" style={{ marginBottom: "12px" }}>Online Profiles</div>
              <div className="social-strip-btns">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn-dark"
                >
                  <span>🐙</span>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn-dark"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="contact-form-editorial-panel">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2-col">
                <div className="form-group-item">
                  <label className="label-portix-text">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="input-portix-field"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group-item">
                  <label className="label-portix-text">Your Email *</label>
                  <input
                    type="email"
                    required
                    className="input-portix-field"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-item">
                <label className="label-portix-text">Subject</label>
                <input
                  type="text"
                  className="input-portix-field"
                  placeholder="Project Consultation / Job Opportunity"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group-item">
                <label className="label-portix-text">Message *</label>
                <textarea
                  rows="5"
                  required
                  className="textarea-portix-field"
                  placeholder="Tell me about your goals or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-portix-send-message" disabled={submitting}>
                {submitting ? "Sending Message..." : "Send Message ➔"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {toast && (
        <div className={`toast-portix-alert toast-portix-${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};

export default Contact;
