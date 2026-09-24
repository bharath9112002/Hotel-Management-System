const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const compactNumberFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
})

const fullDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

// Parsed as local midnight so a plain 'YYYY-MM-DD' never shifts a day.
export function formatDate(isoDate) {
  return fullDateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatCompactNumber(value) {
  return compactNumberFormatter.format(value)
}

export function formatShortDate(isoDate) {
  return dateFormatter.format(new Date(isoDate))
}
