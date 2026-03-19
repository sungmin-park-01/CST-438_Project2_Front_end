import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>All Users</h1>
            <button onClick={() => navigate("/")} style={{ marginBottom: 16 }}>← Back</button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr
                        key={user.userId}
                        onClick={() => navigate(`/users/${user.userId}`)}
                        style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                    >
                        <td style={tdStyle}>{user.username}</td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = { padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "10px" };