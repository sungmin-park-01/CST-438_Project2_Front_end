import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await apiFetch("/api/me");
        if (user) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        // if not authenticated, that's fine
        if (err.status !== 401) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  function handleLogin() {
    // Redirect to Spring Security OAuth2 login endpoint
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to the App</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}