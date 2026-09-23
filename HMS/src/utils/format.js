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

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatCompactNumber(value) {
  return compactNumberFormatter.format(value)
}

export function formatShortDate(isoDate) {
  return dateFormatter.format(new Date(isoDate))
}
