import Modal from './Modal'

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isConfirming = false,
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const confirmClasses =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
      : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'

  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-500">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
        >
          {isConfirming ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
