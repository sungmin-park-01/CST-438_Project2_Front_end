import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/UserEntryPage.css";

export default function UserEntryPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/admin/${userId}`);
        setUser(data);
        setSelectedRole(data.role);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleUpdate = async () => {
    if (user?.role === "ADMIN") {
      return;
    }

    try {
      const updated = await apiFetch(`/admin/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
      });
      setUser(updated);
      setShowUpdateModal(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (user?.role === "ADMIN") {
      return;
    }

    try {
      await apiFetch(`/admin/${userId}`, { method: "DELETE" });
      navigate("/users");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="jt-page"><div className="jt-shell"><div className="jt-loading-state">Loading user...</div></div></div>;
  if (error) return <div className="jt-page"><div className="jt-shell"><div className="jt-error-state">{error}</div></div></div>;
  if (!user) return <div className="jt-page"><div className="jt-shell"><div className="jt-empty-state">User not found.</div></div></div>;
  const isAdminUser = user.role === "ADMIN";

  return (
    <div className="jt-page user-entry-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Admin Controls</span>
          <h1 className="jt-title">User Entry</h1>
          <p className="jt-subtitle">
            Review account details, promote roles when needed, and manage access from one place.
          </p>
        </section>

        <div className="user-entry-toolbar">
          <button className="jt-btn-secondary" onClick={() => navigate("/users")}>
            Back to users
          </button>
        </div>

        <section className="jt-panel jt-detail-card">
          {isAdminUser && (
            <div className="user-admin-notice">
              This account is an admin. You can view it here, but its role cannot be changed and it cannot be deleted.
            </div>
          )}

          <div className="row g-4">
            <div className="col-md-6">
              <div className="user-detail-block">
                <div className="jt-kpi-label">User ID</div>
                <div className="user-detail-value">{user.userId}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="user-detail-block">
                <div className="jt-kpi-label">Role</div>
                <div className="user-detail-value">{user.role}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="user-detail-block">
                <div className="jt-kpi-label">Username</div>
                <div className="user-detail-value">{user.username}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="user-detail-block">
                <div className="jt-kpi-label">Email</div>
                <div className="user-detail-value">{user.email || "No email provided"}</div>
              </div>
            </div>
          </div>

          <div className="user-entry-actions">
            <button className="jt-btn-success" onClick={() => setShowUpdateModal(true)} disabled={isAdminUser}>
              Update role
            </button>
            <button className="jt-btn-danger" onClick={() => setShowDeleteModal(true)} disabled={isAdminUser}>
              Delete user
            </button>
          </div>
        </section>

        {showUpdateModal && !isAdminUser && (
          <div className="jt-modal-backdrop">
            <div className="jt-panel jt-modal">
              <h2 className="user-modal-title">Update Role</h2>
              <p className="user-modal-copy">Select a new role for <strong>{user.username}</strong>.</p>
              <select className="jt-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className="user-modal-actions">
                <button className="jt-btn-success" onClick={handleUpdate}>Confirm</button>
                <button className="jt-btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && !isAdminUser && (
          <div className="jt-modal-backdrop">
            <div className="jt-panel jt-modal">
              <h2 className="user-modal-title">Delete User</h2>
              <p className="user-modal-copy">
                Are you sure you want to delete <strong>{user.username}</strong>? This cannot be undone.
              </p>
              <div className="user-modal-actions">
                <button className="jt-btn-danger" onClick={handleDelete}>Delete</button>
                <button className="jt-btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
