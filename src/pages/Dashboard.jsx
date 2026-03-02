import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch("/api/me");
        setUser(me);
      } catch (e) {
        // if not logged in, bounce back to login
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  async function handleLogout() {
    try {
      await apiFetch("/logout", { method: "POST" }); // Spring Security default logout
    } catch {
      // ignore
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <pre style={{ background: "#111", color: "#0f0", padding: 12 }}>
        {JSON.stringify(user, null, 2)}
      </pre>

      <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}