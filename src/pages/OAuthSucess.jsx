import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

/**
 * OAuthSuccess page:
 * - Spring redirects here AFTER successful OAuth login
 * - We verify the session cookie works by calling /api/me
 * - Then route to /dashboard
 */
export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Finishing sign-in…");
  const [details, setDetails] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setStatus("Verifying session…");
        await apiFetch("/api/me"); // confirms cookie is present + accepted
        setStatus("Signed in! Redirecting…");
        navigate("/dashboard", { replace: true });
      } catch (e) {
        // If we fail here, it usually means cookie/CORS/SameSite mismatch
        setStatus("Could not verify sign-in.");
        setDetails(e?.message || String(e));
      }
    })();
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>OAuth Success</h1>
        <p style={styles.text}>{status}</p>

        {details && (
          <>
            <p style={styles.hint}>
              This usually means the session cookie isn’t being accepted/sent.
              Confirm backend CORS allows credentials and cookies are not blocked.
            </p>
            <pre style={styles.pre}>{details}</pre>
            <button style={styles.btn} onClick={() => navigate("/", { replace: true })}>
              Back to Login
            </button>
          </>
        )}
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
    maxWidth: 520,
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: 26,
    letterSpacing: "-0.02em",
  },
  text: {
    marginTop: 10,
    color: "#374151",
    fontSize: 16,
  },
  hint: {
    marginTop: 14,
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 1.4,
  },
  pre: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "#111827",
    color: "white",
    overflowX: "auto",
    fontSize: 12,
  },
  btn: {
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    background: "#111827",
    color: "white",
  },
};