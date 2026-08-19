import type { BookingField, BookingStatus, TimeSlot } from '~/types/booking/booking.types'

export const TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
] as const satisfies readonly TimeSlot[]

export const MIN_GUESTS = 1
export const MAX_GUESTS = 12

export const MIN_NAME_LENGTH = 2

export const MIN_BOOKING_DATE_OFFSET = 0
export const MAX_BOOKING_DATE_OFFSET = 90

export const PHONE_DIGIT_COUNT = 11
export const PHONE_ALLOWED_FIRST_DIGITS = ['7', '8'] as const

export const SUBMIT_DELAY_MS = 1500

export const BOOKING_STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
} as const satisfies Record<BookingStatus, BookingStatus>

export const GUEST_OPTIONS = Array.from(
  { length: MAX_GUESTS - MIN_GUESTS + 1 },
  (_, index) => index + MIN_GUESTS,
)

export const BOOKING_FIELDS = ['name', 'phone', 'date', 'time', 'guests'] as const satisfies readonly BookingField[]

export const BOOKING_FIELD_IDS = {
  name: 'booking-name',
  phone: 'booking-phone',
  date: 'booking-date',
  time: 'booking-time',
  guests: 'booking-guests',
} as const

export const BOOKING_FIELD_LABELS = {
  name: 'Имя',
  phone: 'Телефон',
  date: 'Дата',
  time: 'Время',
  guests: 'Гости',
} as const

export const RESTAURANT_NAME = 'Saveur'
export const BOOKING_FORM_TITLE = 'Бронирование стола'
export const BOOKING_SUBMIT_LABEL = 'Забронировать'
export const BOOKING_SUBMIT_LOADING_LABEL = 'Бронирую...'
export const BOOKING_TIME_PLACEHOLDER = 'Выберите время'
export const BOOKING_PHONE_PLACEHOLDER = '+7 (999) 123-45-67'

export const CONFIRMATION_TITLE = 'Столик забронирован'
export const CONFIRMATION_BOOK_AGAIN_LABEL = 'Забронировать ещё'
export const CONFIRMATION_TITLE_ID = 'confirmation-title'
