import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await apiFetch("/api/me");
        navigate("/landing", { replace: true });
      } catch {
        setChecking(false);
      }
    })();
  }, [navigate]);

  const loginWithGithub = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/github`;
  };

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  if (checking) {
    return (
      <div className="jt-page login-page">
        <div className="jt-shell d-flex justify-content-center align-items-center min-vh-100">
          <div className="jt-panel login-card text-center">
            <span className="jt-eyebrow">Candidate Hub</span>
            <h1 className="jt-title login-card-title">Job Tracker</h1>
            <p className="jt-subtitle login-card-subtitle">Checking session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jt-page login-page">
      <div className="jt-shell">
        <div className="row g-4 align-items-center min-vh-100">
          <div className="col-lg-6">
            <section className="jt-hero login-hero">
              <span className="jt-eyebrow">Job Application Tracker</span>
              <h1 className="jt-title">Stay on top of every application, interview, and next step.</h1>
              <p className="jt-subtitle">
                Group 7; CST438
              </p>

              
            </section>
          </div>

          <div className="col-lg-6">
            <section className="jt-panel login-card">
              <span className="jt-eyebrow">Sign In</span>
              <h2 className="login-heading">Welcome back</h2>
              <p className="login-lead">
                Connect your account to view your pipeline, update statuses, and keep notes in sync.
              </p>

              <div className="login-actions">
                <button className="jt-btn-primary w-100" onClick={loginWithGithub}>
                  Continue with GitHub
                </button>
                <button className="jt-btn-secondary w-100" onClick={loginWithGoogle}>
                  Continue with Google
                </button>
              </div>

              {error && <p className="login-error">{error}</p>}

              <p className="login-meta">
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
