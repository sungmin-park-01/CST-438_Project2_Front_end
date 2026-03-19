import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

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
        try {
            await apiFetch(`/admin/${userId}`, { method: "DELETE" });
            navigate("/users");
        } catch (e) {
            setError(e.message);
        }
    };

    if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
    if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
    if (!user) return <p style={{ padding: 24 }}>User not found</p>;

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
            <button onClick={() => navigate("/users")} style={{ marginBottom: 16 }}>← Back</button>
            <h1>User Entry</h1>

            <div style={{ backgroundColor: "#f9f9f9", padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <p><b>User ID:</b> {user.userId}</p>
                <p><b>Username:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", gap: 12 }}>
                <button
                    onClick={() => setShowUpdateModal(true)}
                    style={{ backgroundColor: "#2ecc71", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: 4 }}
                >
                    Update Role
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: 4 }}
                >
                    Delete User
                </button>
            </div>

            {/* Update Modal */}
            {showUpdateModal && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h2>Update Role</h2>
                        <p>Select a new role for <b>{user.username}</b>:</p>
                        <select
                            value={selectedRole}
                            onChange={e => setSelectedRole(e.target.value)}
                            style={{ padding: 8, marginBottom: 16, width: "100%" }}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={handleUpdate} style={{ backgroundColor: "#2ecc71", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", borderRadius: 4 }}>
                                Confirm
                            </button>
                            <button onClick={() => setShowUpdateModal(false)} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: 4 }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h2>Delete User</h2>
                        <p>Are you sure you want to delete <b>{user.username}</b>? This cannot be undone.</p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={handleDelete} style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", borderRadius: 4 }}>
                                Delete
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: 4 }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center"
};

const modalStyle = {
    backgroundColor: "white", padding: 24, borderRadius: 8,
    minWidth: 300, maxWidth: 400
};