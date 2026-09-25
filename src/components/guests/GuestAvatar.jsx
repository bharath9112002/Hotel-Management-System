import { getInitials } from '../../utils/guestTransform'

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  lg: 'h-20 w-20 text-2xl',
}

export default function GuestAvatar({ name, size = 'sm' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ${SIZES[size]}`}
    >
      {getInitials(name)}
    </div>
  )
}
