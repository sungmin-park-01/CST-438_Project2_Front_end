import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // confirm session exists
        await apiFetch("/api/me");
        navigate("/dashboard", { replace: true });
      } catch (e) {
        setError(e.message || "Login verification failed");
      }
    })();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Signing you in...</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}