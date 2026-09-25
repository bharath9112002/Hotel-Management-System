import { Link } from 'react-router-dom'
import GuestAvatar from './GuestAvatar'

export default function GuestTable({ guests, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Nationality</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50">
          {guests.map((guest) => (
            <tr key={guest.id} className="transition hover:bg-ink-50/50">
              <td className="px-4 py-3">
                <Link to={`/guests/${guest.id}`} className="flex items-center gap-3">
                  <GuestAvatar name={guest.fullName} />
                  <span>
                    <span className="block font-semibold text-ink-900 hover:text-brand-600">
                      {guest.fullName}
                    </span>
                    <span className="block text-xs text-ink-400">{guest.email}</span>
                  </span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-600">{guest.mobile}</td>
              <td className="px-4 py-3 text-ink-600">{guest.nationality}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/guests/${guest.id}`}
                    className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => onEdit(guest)}
                    className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(guest)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
