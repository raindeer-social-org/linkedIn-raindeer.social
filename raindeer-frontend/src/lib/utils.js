// Utility: merge classnames (clsx + tailwind-merge)
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format large numbers
export function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toString()
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// Truncate text
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

// Sleep utility for fake async
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Platform color map
export const platformColors = {
  Instagram: { bg: 'rgba(225,48,108,0.15)', border: 'rgba(225,48,108,0.4)', text: '#E1306C', dot: '#E1306C' },
  LinkedIn:  { bg: 'rgba(10,102,194,0.15)', border: 'rgba(10,102,194,0.4)', text: '#0A66C2', dot: '#0A66C2' },
  YouTube:   { bg: 'rgba(255,0,0,0.12)',    border: 'rgba(255,0,0,0.35)',    text: '#FF0000', dot: '#FF0000' },
  X:         { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)', text: '#F5F7FA', dot: '#F5F7FA' },
  Twitter:   { bg: 'rgba(29,155,240,0.12)',  border: 'rgba(29,155,240,0.35)',  text: '#1D9BF0', dot: '#1D9BF0' },
}
