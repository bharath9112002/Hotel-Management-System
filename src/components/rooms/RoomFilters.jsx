import { AVAILABILITY_STATUSES, ROOM_TYPES } from '../../data/roomConstants'

export default function RoomFilters({
  search,
  onSearchChange,
  roomType,
  onRoomTypeChange,
  availability,
  onAvailabilityChange,
  sortOrder,
  onSortOrderChange,
  isAdmin,
  onAddRoom,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search room number or type…"
            className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
          />
        </div>

        <select
          value={roomType}
          onChange={(e) => onRoomTypeChange(e.target.value)}
          className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
        >
          <option value="">All room types</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => onAvailabilityChange(e.target.value)}
          className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
        >
          <option value="">All availability</option>
          {AVAILABILITY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
          className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/60"
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {isAdmin && (
        <button
          type="button"
          onClick={onAddRoom}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Room
        </button>
      )}
    </div>
  )
}
