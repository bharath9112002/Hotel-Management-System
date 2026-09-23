import { toast } from 'react-toastify'

export default function QuickActions({ actions }) {
  const handleClick = (action) => {
    toast.info(`${action.label} lands in ${action.module} — coming soon.`)
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-ink-800">Quick actions</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleClick(action)}
            className="group flex items-start gap-3 rounded-xl border border-ink-100 p-3.5 text-left transition hover:border-brand-300 hover:bg-brand-50/60"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500 transition group-hover:bg-brand-100 group-hover:text-brand-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                <path
                  d="M12 5v14m-7-7h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-medium text-ink-800">{action.label}</span>
              <span className="mt-0.5 block text-xs text-ink-400">{action.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
