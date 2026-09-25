// Last successfully fetched rooms/guests are kept in localStorage so pages can
// render instantly and refresh in the background, instead of waiting on the
// slow DummyJSON mock every time.
export function readListCache(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key))
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

export function writeListCache(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Storage unavailable/full: caching is only an optimisation.
  }
}
