import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8001",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const AdminDashboard = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/logout");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log out. Please try again."
      );
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
          width: min(520px, 100%);
          background: rgba(8, 12, 30, 0.92);
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
          margin-top: 18px;
        }
      `}</style>

      <div className="auth-card">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard. This page is available after successful authentication.</p>

        <button
          className="auth-button"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>

        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
