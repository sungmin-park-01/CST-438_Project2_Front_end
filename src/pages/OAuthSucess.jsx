import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/OAuthSuccess.css";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Finishing sign-in...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setStatus("Verifying session...");
        await apiFetch("/api/me");
        setStatus("Signed in. Redirecting...");
        navigate("/landing", { replace: true });
      } catch (e) {
        setStatus("Could not verify sign-in.");
        setDetails(e?.message || String(e));
      }
    })();
  }, [navigate]);

  return (
    <div className="jt-page oauth-page">
      <div className="jt-shell d-flex justify-content-center align-items-center min-vh-100">
        <section className="jt-panel oauth-card text-center">
          <span className="jt-eyebrow">Authentication</span>
          <h1 className="jt-title oauth-title">OAuth Status</h1>
          <p className="jt-subtitle oauth-copy">{status}</p>

          {details && (
            <>
              <p className="oauth-hint">
                This usually means the session cookie is not being accepted or sent back to the backend.
              </p>
              <pre className="jt-code text-start">{details}</pre>
              <button className="jt-btn-primary mt-4" onClick={() => navigate("/", { replace: true })}>
                Back to login
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
