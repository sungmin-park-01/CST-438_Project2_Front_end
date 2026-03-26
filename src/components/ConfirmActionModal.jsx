import "../css/ConfirmActionModal.css";

export default function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
}) {
  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop" onClick={busy ? undefined : onCancel}>
      <div className="confirm-modal-card jt-panel" onClick={(event) => event.stopPropagation()}>
        <span className="jt-eyebrow">Please Confirm</span>
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-copy">{message}</p>

        <div className="confirm-modal-actions">
          <button className="jt-btn-secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button className="jt-btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
