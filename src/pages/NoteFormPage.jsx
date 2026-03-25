import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function NoteFormPage() {
  const navigate = useNavigate();
  const { applicationId, noteId } = useParams();

  const location = useLocation();

  const isNew =
    location.pathname.includes("/notes/new/") ||
    location.pathname.includes("/note/new");

  const isEdit =
    location.pathname.includes("/notes/edit/") ||
    (location.pathname.includes("/note/") &&
      location.pathname.endsWith("/edit"));
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

        const data = await apiFetch(
          `/job-applications/${applicationId}/note/${noteId}`
        );

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
        await apiFetch(
          `/job-applications/${applicationId}/note/${noteId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              content: content,
              lastEdited: new Date().toISOString(),
              application: {
                applicationId: Number(applicationId),
              },
            }),
          }
        );
      } else {
        const created = await apiFetch(
          `/job-applications/${applicationId}/note`,
          {
            method: "POST",
            body: JSON.stringify({
              content: content,
              lastEdited: new Date().toISOString(),
              jobApplication: {
                applicationId: Number(applicationId),
              },
            }),
          }
        );
        const createdNoteId = created?.notesId ?? created?.noteId;
        if (createdNoteId) {
          navigate(`/applications/${applicationId}/note/${createdNoteId}`, {
            replace: true,
          });
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
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isView ? "Note details" : isEdit ? "Edit Note" : "Add Note"}
        </h1>

        <textarea
          style={styles.textarea}
          value={content}
          onChange={isView ? undefined : (e) => setContent(e.target.value)}
          placeholder="Write your note..."
          readOnly={isView}
        />

        {error && <p style={styles.error}>{error}</p>}

        {isView ? (
          <div style={styles.viewActions}>
            <button
              style={styles.secondaryBtn}
              onClick={() =>
                navigate(`/applications/${applicationId}/note/${noteId}/edit`)
              }
            >
              edit note
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/notes")}>
              Back to notes
            </button>
          </div>
        ) : (
          <button
            style={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "white",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: 16,
  },
  textarea: {
    width: "100%",
    height: 200,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "vertical",
    marginBottom: 16,
  },
  saveBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryBtn: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  viewActions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};