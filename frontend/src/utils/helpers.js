export const formatDate = (date) => {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getTrafficColor = (level) => {
  const colors = {
    Low: 'text-success border-success bg-success/10',
    Medium: 'text-warning border-warning bg-warning/10',
    Heavy: 'text-danger border-danger bg-danger/10'
  }
  return colors[level] || 'text-gray-400'
}

export const getStatusBadge = (status) => {
  const statuses = {
    online: 'bg-success/20 text-success border-success/30',
    offline: 'bg-danger/20 text-danger border-danger/30',
    active: 'bg-success/20 text-success border-success/30',
    reviewed: 'bg-warning/20 text-warning border-warning/30',
    resolved: 'bg-success/20 text-success border-success/30'
  }
  return statuses[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
}

export const debounce = (func, delay = 300) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export default { formatDate, formatNumber, getTrafficColor, getStatusBadge, debounce }