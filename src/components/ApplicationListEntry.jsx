

import { useNavigate } from "react-router-dom";

export default function ApplicationListEntry({ application, onClick }) {
  const navigate = useNavigate();

  // Note existence may or may not be included in the application DTO.
  // Try a few common shapes so the UI can still render correctly.
  const noteId =
    application?.noteId ??
    application?.notesId ??
    application?.note?.noteId ??
    application?.note?.notesId ??
    null;

  const hasNote = noteId !== null && noteId !== undefined;

  return (
    <div>
      <button onClick={onClick}>{application.jobTitle}</button>
      <button
        onClick={() =>
          hasNote
            ? navigate(`/applications/${application.applicationId}/note/${noteId}`)
            : navigate(`/applications/${application.applicationId}/note/new`)
        }
      >
        {hasNote ? "note" : "add note"}
      </button>
    </div>
  );
}