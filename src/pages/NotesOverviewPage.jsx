import React, { useEffect, useState } from "react";
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

function NoteCard({ note }) {
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
          onClick={() => onDelete(note.notesId)}
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

  if (loading) {
    return <p style={{ padding: 40 }}>Loading notes...</p>;
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.lastEdited) - new Date(a.lastEdited)
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Application Notes</h1>

      <div style={styles.list}>
        {sortedNotes.map(note => (
          <NoteCard key={note.notesId} note={note} />
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
    fontFamily: "Arial"
  },

  pageTitle: {
    fontSize: "32px",
    marginBottom: "30px"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
  },

  jobTitle: {
    margin: 0,
    fontSize: "22px"
  },

  meta: {
    margin: "5px 0",
    color: "#555"
  },

  contentBox: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    marginBottom: "15px"
  },

  lastEdited: {
    fontSize: "14px",
    color: "#777"
  },

  buttonRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px"
  },

  editBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ffb4b4",
    background: "#fff5f5",
    color: "#b91c1c",
    cursor: "pointer"
  }
};