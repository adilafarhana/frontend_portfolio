import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { setAdminUser, isLoggedIn } from "../utils/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("adila@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/api/admin/login", { email, password });
      if (res?.data?.user) {
        setAdminUser(res.data.user, res.data.token || "");
      }
      navigate("/admin/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Check credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060813;
          color: #f4f6ff;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        /* Ambient Glow Circles */
        .glow-orb-1 {
          position: absolute;
          top: 15%;
          left: 20%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(6, 8, 19, 0) 70%);
          pointer-events: none;
          animation: floatOrb 8s ease-in-out infinite alternate;
        }

        .glow-orb-2 {
          position: absolute;
          bottom: 15%;
          right: 20%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(6, 8, 19, 0) 70%);
          pointer-events: none;
          animation: floatOrb 10s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatOrb {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-30px) scale(1.08); }
        }

        .auth-card {
          width: min(450px, 100%);
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
          padding: 44px 38px;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 10;
          animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .brand-logo {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #ffffff;
          font-size: 1.4rem;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
        }

        .auth-card h1 {
          margin: 0 0 6px 0;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-card p {
          color: #94a3b8;
          margin-bottom: 28px;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .auth-form {
          display: grid;
          gap: 20px;
        }

        .auth-form label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #cbd5e1;
        }

        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .auth-form input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          padding: 14px 18px;
          font-size: 0.98rem;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .password-wrapper input {
          padding-right: 48px;
        }

        .auth-form input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .eye-toggle-btn:hover {
          color: #ffffff;
        }

        .auth-button {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 15px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 25px rgba(168, 85, 247, 0.35);
          transition: all 0.25s ease;
          margin-top: 4px;
        }

        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5);
        }

        .auth-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .auth-error {
          border-radius: 14px;
          padding: 14px 16px;
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>

      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo">A</div>
          <div>
            <h1>Admin Sign In</h1>
          </div>
        </div>
        <p>Welcome back! Enter your credentials to access the portfolio control center.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="admin-password">Password</label>
            <div className="password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            className="auth-button"
            id="admin-login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
