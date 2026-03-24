import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.jobTitle}>{note.jobTitle}</h2>

      <p style={styles.meta}>Company: {note.company}</p>
      <p style={styles.meta}>Status: {note.status}</p>

      <div style={styles.contentBox}>
        {note.content}
      </div>

      <p style={styles.lastEdited}>
        Last edited: {formatDate(note.lastEdited)}
      </p>

      <div style={styles.buttonRow}>
        <button
          style={styles.editBtn}
          onClick={() => onEdit(note)}
        >
          Edit
        </button>

        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(note)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Modal 
function handleEdit(note) {
  setSelectedNote(note);
  setEditContent(note.content);
  setIsEditModalOpen(true);
}


async function handleSaveEdit() {
  try {
    await apiFetch(`/job-applications/notes/${selectedNote.notesId}`, {
      method: "PUT",
      body: JSON.stringify({
        content: editContent
      }),
    });

    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.notesId === selectedNote.notesId
          ? { ...note, content: editContent, lastEdited: new Date().toISOString() }
          : note
      )
    );

    setIsEditModalOpen(false);
    setSelectedNote(null);
    setEditContent("");
  } catch (err) {
    console.error("Failed to update note", err);
  }
}

export default function NotesOverviewPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await apiFetch("/job-applications/notes");
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  const handleEdit = (note) => {
    navigate(`/notes/edit/${note.applicationId}/${note.notesId}`);
  };

  const handleDelete = async (note) => {
    const confirmed = window.confirm(
      `Delete note for "${note.jobTitle}"?`
    );

    if (!confirmed) return;

    try {

      await apiFetch(`/job-applications/${note.applicationId}/note/${note.notesId}`, {
        method: "DELETE",
      });

      setNotes((prev) => prev.filter((n) => n.notesId !== note.notesId));
    } catch (err) {
      console.error("Failed to delete note", err);
      alert("Delete failed.");
    }
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading notes...</p>;
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)
  );

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Application Notes</h1>
      </div>

      <div style={styles.list}>
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.notesId}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "12px",
  },
  pageTitle: {
    fontSize: "32px",
    margin: 0,
  },
  addBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyState: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    color: "#666",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  jobTitle: {
    margin: 0,
    fontSize: "22px",
  },
  meta: {
    margin: "5px 0",
    color: "#555",
  },
  contentBox: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    marginBottom: "15px",
    whiteSpace: "pre-wrap",
  },
  lastEdited: {
    fontSize: "14px",
    color: "#777",
  },
  buttonRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ffb4b4",
    background: "#fff5f5",
    color: "#b91c1c",
    cursor: "pointer",
  },
};