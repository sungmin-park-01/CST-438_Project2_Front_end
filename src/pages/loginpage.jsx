import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

/**
 * Login page:
 * - If already logged in (cookie session exists), redirect to /dashboard
 * - Otherwise show a "Login with GitHub" button that sends browser to Spring OAuth start
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  // If user already has a valid Spring session cookie, skip login page
  useEffect(() => {
    (async () => {
      try {
        await apiFetch("/api/me"); // will succeed if logged in
        navigate("/landing", { replace: true });
      } catch {
        // Not logged in, stay on login page
      } finally {
        setChecking(false);
      }
    })();
  }, [navigate]);

  // GitHub
  const loginWithGithub = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/github`;
  };

  // Google
  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };



  if (checking) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Job Tracker</h1>
          <p style={styles.text}>Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Job Tracker</h1>
        <p style={styles.text}>Sign in to continue</p>

        <button style={styles.primaryBtn} onClick={loginWithGithub}>
          Continue with GitHub(for testing, redirects to /oauth-success without real OAuth)
        </button>

        <div style={{ height: 12 }} />

        <button style={styles.primaryBtn} onClick={loginWithGoogle}>
          Continue with Google(for testing, redirects to /dashboard without real OAuth)
        </button>

        <div style={{ height: 12 }} />

       

        <div style={{ height: 12 }} />


        <div style={{ height: 12 }} />

       

        {/* Uncomment if you add Google OAuth on backend */}
        {/* <button style={styles.secondaryBtn} onClick={loginWithGoogle}>
          Continue with Google
        </button> */}

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.small}>
          Backend: <code>{import.meta.env.VITE_API_URL}</code>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#f6f7fb",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: 28,
    letterSpacing: "-0.02em",
  },
  text: {
    marginTop: 8,
    marginBottom: 18,
    color: "#555",
  },
  primaryBtn: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  secondaryBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: 700,
    background: "white",
    color: "#111827",
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    marginTop: 12,
    color: "#b91c1c",
    fontWeight: 600,
  },
  small: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: 12,
  },
};