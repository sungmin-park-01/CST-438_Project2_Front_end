import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
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

  const logout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
      navigate("/", { replace: true });
    } catch (e) {
      setError(String(e.message || e));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}