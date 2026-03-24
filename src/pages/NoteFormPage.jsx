import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function NoteFormPage() {
  const navigate = useNavigate();
  const { applicationId, noteId } = useParams();

  const isEditMode = !!noteId;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

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
  }, [applicationId, noteId, isEditMode]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Please enter content");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditMode) {
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
        await apiFetch(
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
      }

      navigate("/notes");

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
          {isEditMode ? "Edit Note" : "Add Note"}
        </h1>

        <textarea
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
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
  error: {
    color: "red",
    marginBottom: 10,
  },
};