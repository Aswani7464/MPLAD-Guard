export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '₹0'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return '₹0'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number)
}

export function formatDate(date) {
  if (!date) {
    return 'Not available'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date'
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatPercentage(value) {
  const number = Number(value)

  if (Number.isNaN(number)) {
    return '0%'
  }

  return `${Math.round(number)}%`
}

export function formatStatus(status) {
  if (!status) {
    return 'Pending'
  }

  return String(status)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
