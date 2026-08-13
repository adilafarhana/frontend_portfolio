import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import apiClient from "../utils/apiClient";
import { setAdminUser, clearAdminUser } from "../utils/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("logout") === "true") {
      clearAdminUser();
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/api/admin/login", { email, password });
      const userData = res?.data?.user || res?.data?.data?.user || { email };
      const tokenData =
        res?.data?.token ||
        res?.data?.access_token ||
        res?.data?.data?.token ||
        "";
      setAdminUser(userData, tokenData);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Authentication failed. Please verify your credentials and backend server.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portix-auth-shell">
      <style>{`
        .portix-auth-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--text-light);
          font-family: var(--font-main);
          padding: 24px;
          position: relative;
        }

        .auth-card-frame {
          width: 100%;
          max-width: 440px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 28px;
          padding: 44px 40px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .auth-corner-cross {
          position: absolute;
          color: var(--accent-orange);
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 300;
          opacity: 0.6;
        }

        .auth-cross-tl { top: 16px; left: 16px; }
        .auth-cross-tr { top: 16px; right: 16px; }
        .auth-cross-bl { bottom: 16px; left: 16px; }
        .auth-cross-br { bottom: 16px; right: 16px; }

        .auth-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240, 90, 40, 0.12);
          border: 1px solid rgba(240, 90, 40, 0.35);
          color: var(--accent-orange);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .auth-title-h1 {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-pure-white);
          margin-bottom: 8px;
        }

        .auth-subtitle-p {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .auth-form-block {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-input-label {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input-field {
          width: 100%;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 14px 44px 14px 46px;
          color: var(--text-pure-white);
          font-size: 0.95rem;
          font-family: var(--font-main);
          font-weight: 600;
          outline: none;
          transition: all 0.2s ease;
        }

        .auth-input-field:focus {
          border-color: var(--accent-orange);
          box-shadow: 0 0 0 3px rgba(240, 90, 40, 0.2);
        }

        .auth-eye-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .auth-eye-btn:hover {
          color: var(--text-pure-white);
        }

        .auth-error-alert {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 700;
        }

        .auth-btn-submit {
          background: var(--accent-orange);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 12px 28px rgba(240, 90, 40, 0.35);
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .auth-btn-submit:hover:not(:disabled) {
          background: var(--accent-orange-hover);
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(240, 90, 40, 0.5);
        }

        .auth-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer-nav {
          margin-top: 32px;
          text-align: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }

        .auth-return-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }

        .auth-return-link:hover {
          color: var(--accent-orange);
        }
      `}</style>

      <motion.div
        className="auth-card-frame"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="auth-corner-cross auth-cross-tl">+</span>
        <span className="auth-corner-cross auth-cross-tr">+</span>
        <span className="auth-corner-cross auth-cross-bl">+</span>
        <span className="auth-corner-cross auth-cross-br">+</span>

        <div className="auth-brand-badge">
          <span>✱</span>
          <span>SECURITY PORTAL</span>
        </div>

        <h1 className="auth-title-h1">Admin Sign In</h1>
        <p className="auth-subtitle-p">
          Access your backend dashboard to manage portfolio case studies, tech stack, and inquiries.
        </p>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-block">
          <div className="auth-input-group">
            <label className="auth-input-label">Admin Email</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="username"
                className="auth-input-field"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="auth-input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-eye-btn"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn-submit"
          >
            <ShieldCheck size={18} />
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
          </button>
        </form>

        <div className="auth-footer-nav">
          <Link to="/" className="auth-return-link">
            <ArrowLeft size={14} />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
