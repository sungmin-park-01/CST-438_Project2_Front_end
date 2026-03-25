import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { applicationService } from "../service/ApplicationService";
import { jobEntryService } from "../service/JobEntryService";
import "../css/ApplicationEntry.css";

const emptyApplication = {
  jobTitle: "",
  companyName: "",
  salaryText: "",
  postingURL: "",
  status: "",
  dateApplied: "",
};

export default function ApplicationEntry() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isNew = location.pathname.endsWith("/new");
  const isEdit = location.pathname.endsWith("/edit");
  const isView = !!applicationId && !isEdit;

  const [application, setApplication] = useState(emptyApplication);
  const [originalApplication, setOriginalApplication] = useState(null);
  const [loading, setLoading] = useState(!isNew);

  const jobEntryFields = ["jobTitle", "companyName", "salaryText", "postingURL"];
  const jobApplicationFields = ["status", "dateApplied"];

  useEffect(() => {
    if (isNew) {
      setApplication(emptyApplication);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const app = await applicationService.getApplication(applicationId);
        const entry = await jobEntryService.getEntry(app.jobId);

        const applicationPayload = {
          jobId: app.jobId,
          jobTitle: entry.jobTitle,
          companyName: entry.companyName,
          salaryText: entry.salaryText,
          postingURL: entry.postingURL,
          status: app.status,
          dateApplied: app.dateApplied,
        };

        setApplication(applicationPayload);
        setOriginalApplication({ ...applicationPayload });
      } catch (e) {
        console.log(e);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [applicationId, isNew, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const createdEntry = await jobEntryService.createEntry({
        companyName: application.companyName,
        jobTitle: application.jobTitle,
        salaryText: application.salaryText,
        postingURL: application.postingURL,
      });

      const createdApplication = await applicationService.createApplication({
        jobId: createdEntry.jobId,
        status: application.status,
        dateApplied: application.dateApplied,
      });

      navigate(`/applications/${createdApplication.applicationId}`);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const entryChanged = hasChanges(originalApplication, application, jobEntryFields);
      const appChanged = hasChanges(originalApplication, application, jobApplicationFields);

      if (entryChanged) {
        await jobEntryService.replaceEntry(application.jobId, {
          companyName: application.companyName,
          jobTitle: application.jobTitle,
          salaryText: application.salaryText,
          postingURL: application.postingURL,
        });
      }

      if (appChanged) {
        await applicationService.replaceApplication(applicationId, {
          jobId: application.jobId,
          status: application.status,
          dateApplied: application.dateApplied,
        });
      }

      navigate(`/applications/${applicationId}`);
    } catch (e) {
      console.error(e);
    }
  }

  function hasChanges(original, current, keys) {
    return keys.some((key) => original[key] !== current[key]);
  }

  if (loading) {
    return (
      <div className="jt-page application-entry-page">
        <div className="jt-shell">
          <div className="jt-loading-state">Loading application...</div>
        </div>
      </div>
    );
  }

  const modeTitle = isNew ? "Create application" : isEdit ? "Edit application" : "Application details";

  return (
    <div className="jt-page application-entry-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Job Application Tracker</span>
          <h1 className="jt-title">{modeTitle}</h1>
          <p className="jt-subtitle">
            Capture the essential job details, keep the application status current, and return later to update your progress.
          </p>
        </section>

        <div className="application-entry-toolbar">
          <button type="button" className="jt-btn-secondary" onClick={() => navigate("/applications")}>
            Back to applications
          </button>
        </div>

        {(isNew || isEdit) && (
          <section className="jt-panel jt-form-card">
            <form className="row g-4" onSubmit={isNew ? handleCreate : handleUpdate}>
              <div className="col-md-6">
                <label className="jt-label">Job Title</label>
                <input className="jt-input" name="jobTitle" value={application.jobTitle} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="jt-label">Company</label>
                <input className="jt-input" name="companyName" value={application.companyName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="jt-label">Salary</label>
                <input className="jt-input" name="salaryText" value={application.salaryText} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="jt-label">Posting URL</label>
                <input className="jt-input" name="postingURL" value={application.postingURL} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="jt-label">Status</label>
                <input className="jt-input" name="status" value={application.status} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="jt-label">Date Applied</label>
                <input className="jt-input" type="date" name="dateApplied" value={application.dateApplied} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="jt-btn-primary">
                  {isNew ? "Create application" : "Update application"}
                </button>
              </div>
            </form>
          </section>
        )}

        {isView && (
          <section className="jt-panel jt-detail-card">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Job Title</div>
                  <div className="application-detail-value">{application.jobTitle}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Company</div>
                  <div className="application-detail-value">{application.companyName}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Salary</div>
                  <div className="application-detail-value">{application.salaryText}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Status</div>
                  <div className="application-detail-value">{application.status}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Posting</div>
                  <div className="application-detail-value application-link">{application.postingURL}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="application-detail-block">
                  <div className="jt-kpi-label">Date Applied</div>
                  <div className="application-detail-value">{application.dateApplied}</div>
                </div>
              </div>
            </div>

            <div className="application-entry-actions">
              <button className="jt-btn-primary" onClick={() => navigate(`/applications/${applicationId}/edit`)}>
                Edit application
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
