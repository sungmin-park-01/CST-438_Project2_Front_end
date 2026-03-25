import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../service/ApplicationService";
import ApplicationListEntry from "../components/ApplicationListEntry";
import "../css/AllApplications.css";

export default function AllApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch {
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="jt-page applications-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Job Application Tracker</span>
          <h1 className="jt-title">Applications</h1>
          <p className="jt-subtitle">
            Track every role in one view, jump into details, and keep your notes attached to the right opportunity.
          </p>
        </section>

        <section className="jt-panel applications-panel">
          <div className="applications-toolbar">
            <div>
              <h2 className="applications-heading">Your opportunities</h2>
              <p className="applications-copy">
                {applications.length} application{applications.length === 1 ? "" : "s"} in your tracker
              </p>
            </div>
            <div className="applications-actions">
              <button className="jt-btn-secondary" onClick={() => navigate("/landing")}>
                Back to landing page
              </button>
              <button className="jt-btn-primary" onClick={() => navigate("/applications/new")}>
                Add application
              </button>
            </div>
          </div>

          <div className="jt-stack">
            {applications.length === 0 ? (
              <div className="jt-empty-state">No applications found yet. Start by adding your first role.</div>
            ) : (
              applications.map((app) => (
                <ApplicationListEntry
                  key={app.applicationId}
                  onClick={() => navigate(`/applications/${app.applicationId}`)}
                  application={app}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
