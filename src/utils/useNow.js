import { useEffect, useState } from 'react'

// Re-renders the caller on an interval so live values (like how long an
// in-house guest has stayed so far) stay current without a reload.
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
