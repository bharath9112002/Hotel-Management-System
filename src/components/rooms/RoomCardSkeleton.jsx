export default function RoomCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
      <div className="h-40 w-full animate-pulse bg-ink-100" />
      <div className="space-y-3 p-4">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-full bg-ink-100" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-ink-100" />
        </div>
      </div>
    </div>
  )
}
