import { useNavigate } from "react-router-dom";
import "../css/ApplicationListEntry.css";

export default function ApplicationListEntry({ application, onClick }) {
  const navigate = useNavigate();

  const noteId =
    application?.noteId ??
    application?.notesId ??
    application?.note?.noteId ??
    application?.note?.notesId ??
    null;

  const hasNote = noteId !== null && noteId !== undefined;

  return (
    <article className="application-list-entry">
      <button className="application-list-main" onClick={onClick}>
        <span className="application-list-company">{application.companyName ?? "Company Name"}</span>
        <span className="application-list-title">{application.jobTitle}</span>
        <span className="application-list-meta">
          <span>{application.status ?? "In progress"}</span>
          <span>{application.dateApplied ?? "No date"}</span>
        </span>
      </button>
      <button
        className="application-list-note"
        onClick={() =>
          hasNote
            ? navigate(`/applications/${application.applicationId}/note/${noteId}`)
            : navigate(`/applications/${application.applicationId}/note/new`)
        }
      >
        {hasNote ? "Open note" : "Add note"}
      </button>
    </article>
  );
}
