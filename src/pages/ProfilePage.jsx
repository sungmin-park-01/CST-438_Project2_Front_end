import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../service/UserService";
import "../css/ProfilePage.css";

function formatProvider(provider) {
  if (!provider) return "Unknown";

  const normalized = provider.toLowerCase();
  if (normalized === "github") return "GitHub";
  if (normalized === "google") return "Google";

  return provider;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await UserService.getCurrentUser();
        setUser(me);
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await UserService.logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await UserService.deleteCurrentUser();
      await UserService.logout();
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div className="jt-page"><div className="jt-shell"><div className="jt-loading-state">Loading profile...</div></div></div>;
  }

  return (
    <div className="jt-page profile-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero profile-hero">
          <span className="jt-eyebrow">My Profile</span>
          <h1 className="jt-title">Keep your account details close at hand.</h1>
          <p className="jt-subtitle">
            Review how your account is represented in the tracker, sign out securely, or remove your account and its saved data.
          </p>
        </section>

        <div className="profile-toolbar">
          <button className="jt-btn-secondary" onClick={() => navigate("/landing")}>
            Back to landing
          </button>
        </div>

        {error && <div className="jt-error-state">{error}</div>}

        <section className="jt-panel jt-detail-card">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Username</div>
                <div className="profile-detail-value">{user?.username ?? user?.login ?? "Unknown"}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Role</div>
                <div className="profile-detail-value">{user?.role ?? "Unknown"}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Display Name</div>
                <div className="profile-detail-value">{user?.name || "Not provided"}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Email</div>
                <div className="profile-detail-value">{user?.email || "Not provided"}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Provider</div>
                <div className="profile-detail-value">{formatProvider(user?.oauthProvider)}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-detail-block">
                <div className="jt-kpi-label">Applications</div>
                <div className="profile-detail-value">{user?.applicationCount ?? 0}</div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="jt-btn-secondary" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
            <button className="jt-btn-danger" onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
              Delete account
            </button>
          </div>
        </section>

        {showDeleteModal && (
          <div className="jt-modal-backdrop">
            <div className="jt-panel jt-modal">
              <h2 className="profile-modal-title">Delete Account</h2>
              <p className="profile-modal-copy">
                This will remove <strong>{user?.username ?? user?.login}</strong> and the data tied to this account. This action cannot be undone.
              </p>
              <div className="profile-modal-actions">
                <button className="jt-btn-danger" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete account"}
                </button>
                <button className="jt-btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
