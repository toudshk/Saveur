import {
  MAX_BOOKING_DATE_OFFSET,
  MIN_BOOKING_DATE_OFFSET,
} from '~/constants/booking/booking.constants'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
}

export function addDaysToDateString(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)

  return formatLocalDateString(date)
}

export function getTodayDateString(now = new Date()): string {
  return formatLocalDateString(now)
}

export function getMinBookingDateString(today = getTodayDateString()): string {
  return addDaysToDateString(today, MIN_BOOKING_DATE_OFFSET)
}

export function getMaxBookingDateString(today = getTodayDateString()): string {
  return addDaysToDateString(today, MAX_BOOKING_DATE_OFFSET)
}

export function isValidCalendarDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  )
}
