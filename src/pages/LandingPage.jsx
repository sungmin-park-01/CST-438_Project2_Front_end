import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../service/UserService";
import "../css/LandingPage.css";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const displayName = user?.name ?? user?.username ?? user?.login ?? "Loading";

  useEffect(() => {
    (async () => {
      try {
        const me = await UserService.getCurrentUser();
        setUser(me);
      } catch {
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await UserService.logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="jt-page landing-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero landing-hero">
          <div className="landing-hero-topbar">
            <span className="jt-eyebrow">Job Application Tracker</span>
            <button className="jt-btn-secondary landing-profile-trigger" onClick={() => setIsProfileOpen(true)}>
              Open profile
            </button>
          </div>
          <h1 className="jt-title">Build momentum in your search, one application at a time.</h1>
          <p className="jt-subtitle">
            Review your pipeline, capture notes after recruiter conversations, and keep your next move obvious.
          </p>

          <div className="jt-kpi-grid mt-4">
            <div className="jt-kpi">
              <div className="jt-kpi-label">Signed In As</div>
              <div className="jt-kpi-value">{displayName}</div>
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

      {isProfileOpen && (
        <div className="profile-drawer-backdrop" onClick={() => setIsProfileOpen(false)}>
          <aside className="profile-drawer jt-panel" onClick={(event) => event.stopPropagation()}>
            <div className="profile-drawer-header">
              <div>
                <div className="jt-kpi-label">Current Profile</div>
                <h2 className="profile-drawer-title">{displayName}</h2>
              </div>
              <button className="profile-drawer-close" onClick={() => setIsProfileOpen(false)} aria-label="Close profile drawer">
                x
              </button>
            </div>

            <div className="profile-drawer-grid">
              <div className="jt-kpi">
                <div className="jt-kpi-label">Role</div>
                <div className="profile-drawer-value">{user?.role ?? "..."}</div>
              </div>
              <div className="jt-kpi">
                <div className="jt-kpi-label">Email</div>
                <div className="profile-drawer-value profile-drawer-value-small">{user?.email || "Not provided"}</div>
              </div>
            </div>

            <p className="profile-drawer-copy">
              Open your profile page to manage your account, or log out right away from here.
            </p>

            <div className="profile-drawer-actions">
              <button
                className="jt-btn-primary"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile");
                }}
              >
                Go to profile page
              </button>
              <button className="jt-btn-secondary" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
