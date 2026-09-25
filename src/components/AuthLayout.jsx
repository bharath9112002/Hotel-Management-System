const HIGHLIGHTS = [
  { title: 'Real-time occupancy', desc: 'Track every room, floor and status at a glance.' },
  { title: 'Guest-first workflow', desc: 'Book, check-in and check-out in a few clicks.' },
  { title: 'Insight-driven reports', desc: 'Revenue, trends and performance in one place.' },
]

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen w-full bg-ink-900">
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-ink-900 p-12 text-brand-50 lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-200 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-ink-100 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-3 animate-fade-in">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white">
              <path
                d="M3 21V8l9-5 9 5v13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21v-6a3 3 0 0 1 6 0v6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12h.01M17 12h.01M7 9h.01M17 9h.01"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Grandview</p>
            <p className="text-xs text-brand-100/80">Hotel Management System</p>
          </div>
        </div>

        <div className="relative z-10 animate-slide-up">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-brand-50 backdrop-blur">
            {eyebrow ?? 'Front Desk, Simplified'}
          </p>
          <h2 className="mb-4 max-w-sm text-3xl font-semibold leading-tight text-white">
            Manage your entire property from a single dashboard.
          </h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-white">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-brand-100/70">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-brand-100/60">
          © {new Date().getFullYear()} Grandview Hotels. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-ink-50 px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M3 21V8l9-5 9 5v13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-ink-800">Grandview HMS</p>
          </div>

          <h1 className="text-2xl font-semibold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>}

          <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-7 shadow-xl shadow-ink-900/5">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-ink-400">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
