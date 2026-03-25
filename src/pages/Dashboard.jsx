import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch("/api/me");
        setUser(me);
      } catch {
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  const logout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
      navigate("/", { replace: true });
    } catch (e) {
      setError(String(e.message || e));
    }
  };

  return (
    <div className="jt-page dashboard-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Profile Overview</span>
          <h1 className="jt-title">Dashboard</h1>
          <p className="jt-subtitle">
            Review your authenticated session details and jump back into your job search workflow.
          </p>
        </section>

        <section className="jt-panel jt-detail-card dashboard-card">
          {user ? (
            <>
              <div className="jt-kpi-grid">
                <div className="jt-kpi">
                  <div className="jt-kpi-label">Name</div>
                  <div className="jt-kpi-value dashboard-kpi">{user.name}</div>
                </div>
                <div className="jt-kpi">
                  <div className="jt-kpi-label">Email</div>
                  <div className="jt-kpi-value dashboard-kpi">{user.email}</div>
                </div>
                <div className="jt-kpi">
                  <div className="jt-kpi-label">Role</div>
                  <div className="jt-kpi-value dashboard-kpi">{user.role}</div>
                </div>
              </div>

              <div className="dashboard-actions">
                <button className="jt-btn-secondary" onClick={() => navigate("/landing")}>
                  Go to landing page
                </button>
                <button className="jt-btn-danger" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="jt-loading-state">Loading dashboard...</div>
          )}

          {error && <p className="jt-error-state mt-3 mb-0">{error}</p>}
        </section>
      </div>
    </div>
  );
}
