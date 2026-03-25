import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import "../css/NoteFormPage.css";

export default function NoteFormPage() {
  const navigate = useNavigate();
  const { applicationId, noteId } = useParams();
  const location = useLocation();

  const isNew = location.pathname.includes("/note/new");
  const isEdit = location.pathname.includes("/note/") && location.pathname.endsWith("/edit");
  const isView = !!noteId && !isNew && !isEdit;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEdit || isView);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit && !isView) return;

    async function loadNote() {
      try {
        setLoading(true);
        const data = await apiFetch(`/job-applications/${applicationId}/note/${noteId}`);
        setContent(data.content || "");
      } catch (err) {
        console.error("Failed to load note", err);
        setError("Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [applicationId, noteId, isEdit, isView]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Please enter content");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEdit) {
        await apiFetch(`/job-applications/${applicationId}/note/${noteId}`, {
          method: "PATCH",
          body: JSON.stringify({
            content,
            lastEdited: new Date().toISOString(),
            application: {
              applicationId: Number(applicationId),
            },
          }),
        });
      } else {
        const created = await apiFetch(`/job-applications/${applicationId}/note`, {
          method: "POST",
          body: JSON.stringify({
            content,
            lastEdited: new Date().toISOString(),
            jobApplication: {
              applicationId: Number(applicationId),
            },
          }),
        });
        const createdNoteId = created?.notesId ?? created?.noteId;
        if (createdNoteId) {
          navigate(`/applications/${applicationId}/note/${createdNoteId}`, { replace: true });
          return;
        }
      }

      navigate(`/applications/${applicationId}/note/${noteId}`, { replace: true });
    } catch (err) {
      console.error("Save failed", err);
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="jt-page note-page">
        <div className="jt-shell">
          <div className="jt-loading-state">Loading note...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="jt-page note-page">
      <div className="jt-shell jt-stack">
        <section className="jt-hero">
          <span className="jt-eyebrow">Application Notes</span>
          <h1 className="jt-title">{isView ? "Note details" : isEdit ? "Edit note" : "Add note"}</h1>
          <p className="jt-subtitle">
            Capture recruiter follow-ups, interview prep details, or reminders that matter for this application.
          </p>
        </section>

        <section className="jt-panel jt-form-card note-card">
          <div className="note-toolbar">
            <button className="jt-btn-secondary" onClick={() => navigate("/applications")}>
              Back to applications
            </button>
            {isView && (
              <button className="jt-btn-primary" onClick={() => navigate(`/applications/${applicationId}/note/${noteId}/edit`)}>
                Edit note
              </button>
            )}
          </div>

          <label className="jt-label">Note content</label>
          <textarea
            className="jt-textarea"
            value={content}
            onChange={isView ? undefined : (e) => setContent(e.target.value)}
            placeholder="Write your note..."
            readOnly={isView}
          />

          {error && <p className="jt-error-state">{error}</p>}

          {!isView && (
            <button className="jt-btn-primary note-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
