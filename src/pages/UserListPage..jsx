import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import UserListEntry from "../components/UserListEntry";
import "../css/UserListPage.css";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const admins = users.filter((user) => user.role === "ADMIN");
  const standardUsers = users.filter((user) => user.role !== "ADMIN");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/admin");
        setUsers(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="jt-page user-list-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Admin Directory</span>
          <h1 className="jt-title">All Users</h1>
          <p className="jt-subtitle">
            Review accounts in the system and open a user record to update roles or remove access.
          </p>
        </section>

        <section className="jt-panel user-list-panel">
          <div className="user-list-toolbar">
            <button className="jt-btn-secondary" onClick={() => navigate("/landing")}>
              Back
            </button>
            <div className="user-list-summary">{users.length} user{users.length === 1 ? "" : "s"}</div>
          </div>

          {loading && <div className="jt-loading-state">Loading users...</div>}
          {error && <div className="jt-error-state">{error}</div>}

          {!loading && !error && (
            <div className="jt-stack user-list-groups">
              <section className="user-list-group">
                <div className="user-list-group-header">
                  <h2 className="user-list-group-title">Admins</h2>
                  <span className="user-list-group-count">{admins.length}</span>
                </div>
                <p className="user-list-group-copy">
                  Admin accounts can be viewed, but their role cannot be changed and they cannot be deleted here.
                </p>
                <div className="jt-stack">
                  {admins.length === 0 ? (
                    <div className="jt-empty-state">No admins found.</div>
                  ) : (
                    admins.map((user) => <UserListEntry key={user.userId} user={user} />)
                  )}
                </div>
              </section>

              <section className="user-list-group">
                <div className="user-list-group-header">
                  <h2 className="user-list-group-title">Users</h2>
                  <span className="user-list-group-count">{standardUsers.length}</span>
                </div>
                <p className="user-list-group-copy">
                  Regular user accounts can be opened and managed from their detail page.
                </p>
                <div className="jt-stack">
                  {standardUsers.length === 0 ? (
                    <div className="jt-empty-state">No regular users found.</div>
                  ) : (
                    standardUsers.map((user) => <UserListEntry key={user.userId} user={user} />)
                  )}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
