// The DummyJSON mock backend intermittently hangs or returns 5xx, so reads are
// retried a couple of times before the UI reports a failure.
export async function withRetry(request, { retries = 2, delayMs = 800 } = {}) {
  let attempt = 0
  for (;;) {
    try {
      return await request()
    } catch (err) {
      if (attempt >= retries) throw err
      attempt += 1
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
    }
  }
}
