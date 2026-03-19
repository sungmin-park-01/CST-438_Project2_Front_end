import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function LandingPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const me = await apiFetch("/api/me");
                setUser(me);
            } catch (e) {
                navigate("/", { replace: true });
            }
        })();
    }, [navigate]);

    const isAdmin = user?.role === "ADMIN";

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
            <h1>Job Application Tracker</h1>
            {user && <p>Welcome, <b>{user.username}</b></p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button onClick={() => navigate("/applications")}>View Applications</button>
                <button onClick={() => navigate("/applications/new")}>Add Application</button>
                {isAdmin && (
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: 10, cursor: "pointer", borderRadius: 4 }}
                    >
                        Admin: View All Users
                    </button>
                )}
            </div>
        </div>
    );
}