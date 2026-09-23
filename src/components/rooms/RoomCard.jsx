import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import RoomStatusBadge from './RoomStatusBadge'

export default function RoomCard({ room, isAdmin, onEdit, onDelete }) {
  const visibleAmenities = room.amenities.slice(0, 3)
  const extraCount = room.amenities.length - visibleAmenities.length

  return (
    <div className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/rooms/${room.id}`} className="block">
        <div className="relative h-40 w-full overflow-hidden bg-ink-50">
          <img
            src={room.image}
            alt={`${room.roomType} interior`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <RoomStatusBadge status={room.availability} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/rooms/${room.id}`}>
              <p className="text-sm font-semibold text-ink-900 hover:text-brand-600">
                Room {room.roomNumber}
              </p>
            </Link>
            <p className="text-xs text-ink-400">{room.roomType} · Floor {room.floorNumber}</p>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-ink-900">
            {formatCurrency(room.pricePerNight)}
            <span className="block text-[11px] font-normal text-ink-400">/ night</span>
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M3.5 19c.7-3.1 2.8-4.8 5.5-4.8s4.8 1.7 5.5 4.8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Sleeps {room.capacity}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleAmenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-ink-50 px-2 py-0.5 text-[11px] text-ink-500"
            >
              {amenity}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[11px] text-ink-400">
              +{extraCount} more
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 flex gap-2 border-t border-ink-50 pt-3">
            <button
              type="button"
              onClick={() => onEdit(room)}
              className="flex-1 rounded-lg border border-ink-200 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(room)}
              className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
