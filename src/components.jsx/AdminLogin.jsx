import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simple POST to API login (no cookie-based auth)
      const res = await apiClient.post("/api/login", { email, password });
      // store basic user info locally and navigate
      if (res?.data?.user) {
        localStorage.setItem("admin_user", JSON.stringify(res.data.user));
      }
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Check credentials.";
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
          background: linear-gradient(135deg, #090b17 0%, #1e1940 100%);
          color: #f4f5ff;
          padding: 20px;
        }

        .auth-card {
          width: min(440px, 100%);
          background: rgba(8, 12, 30, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.35);
          padding: 36px 32px;
          backdrop-filter: blur(14px);
        }

        .auth-card h1 {
          margin-bottom: 18px;
          font-size: 2.1rem;
          letter-spacing: -0.03em;
        }

        .auth-card p {
          color: #b8bee6;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .auth-form {
          display: grid;
          gap: 16px;
        }

        .auth-form label {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: #d8dbf3;
        }

        .auth-form input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          color: #edf2ff;
          padding: 14px 16px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .auth-form input:focus {
          border-color: #8b5cf6;
        }

        .auth-button {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #a855f7, #f97316);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .auth-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 35px rgba(249, 115, 22, 0.3);
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
          background: rgba(255, 73, 73, 0.12);
          color: #ffb3b3;
          border: 1px solid rgba(255, 73, 73, 0.25);
        }

        .auth-note {
          margin-top: 20px;
          font-size: 0.93rem;
          color: #9ca3af;
          line-height: 1.6;
        }
      `}</style>

      <div className="auth-card">
        <h1>Admin Login</h1>
        <p>Sign in with your Laravel admin credentials. This form submits to your backend <code>/login</code> route.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-note">
          If your Laravel backend is hosted on another origin, set <code>REACT_APP_API_BASE_URL</code> in your frontend environment. The current backend URL is <strong>{apiBaseURL}</strong>.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
