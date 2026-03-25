import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/LandingPage.css";

export default function LandingPage() {
  const [user, setUser] = useState(null);
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

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="jt-page landing-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero landing-hero">
          <span className="jt-eyebrow">Job Application Tracker</span>
          <h1 className="jt-title">Build momentum in your search, one application at a time.</h1>
          <p className="jt-subtitle">
            Review your pipeline, capture notes after recruiter conversations, and keep your next move obvious.
          </p>

          <div className="jt-kpi-grid mt-4">
            <div className="jt-kpi">
              <div className="jt-kpi-label">Signed In As</div>
              <div className="jt-kpi-value">{user?.login ?? user?.name ?? "Loading"}</div>
            </div>
            <div className="jt-kpi">
              <div className="jt-kpi-label">Account Role</div>
              <div className="jt-kpi-value">{user?.role ?? "..."}</div>
            </div>
          </div>
        </section>

        <section className="jt-panel landing-panel">
          <div className="landing-panel-copy">
            <h2 className="landing-panel-title">Choose your next action</h2>
            <p className="landing-panel-text">
              Move between your application list, create a new entry, or jump into admin management when you need it.
            </p>
          </div>

          <div className="landing-actions">
            <button className="jt-btn-primary" onClick={() => navigate("/applications")}>
              View applications
            </button>
            <button className="jt-btn-secondary" onClick={() => navigate("/applications/new")}>
              Add application
            </button>
            {isAdmin && (
              <button className="jt-btn-danger" onClick={() => navigate("/users")}>
                Admin: view all users
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
