import {
  BOOKING_FIELDS,
  MAX_BOOKING_DATE_OFFSET,
  MAX_GUESTS,
  MIN_BOOKING_DATE_OFFSET,
  MIN_GUESTS,
  MIN_NAME_LENGTH,
  PHONE_ALLOWED_FIRST_DIGITS,
  PHONE_DIGIT_COUNT,
  TIME_SLOTS,
} from '~/constants/booking/booking.constants'
import type {
  BookingErrors,
  BookingField,
  BookingFormData,
} from '~/types/booking/booking.types'
import {
  addDaysToDateString,
  getTodayDateString,
  isValidCalendarDate,
} from '~/utils/booking/date.utils'
import { normalizePhone } from '~/utils/booking/normalizePhone'

export interface BookingValidationContext {
  today?: string
}

const NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁ]+(?:[ -]+[a-zA-Zа-яА-ЯёЁ]+)*$/
const NON_DIGIT_PATTERN = /\D/g

const ERROR_MESSAGES = {
  nameRequired: 'Введите имя',
  nameMinLength: `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа`,
  nameCharset: 'Имя может содержать только буквы, пробелы и дефис',
  phoneRequired: 'Введите телефон',
  phoneFormat: 'Введите телефон в формате +7XXXXXXXXXX или 8XXXXXXXXXX',
  dateRequired: 'Выберите дату',
  dateInvalid: 'Введите корректную дату',
  dateTooEarly: 'Дата не может быть раньше сегодняшнего дня',
  dateTooLate: `Дата не может быть позже чем через ${MAX_BOOKING_DATE_OFFSET} дней`,
  timeRequired: 'Выберите время',
  timeInvalid: 'Выберите время из доступных слотов',
  guestsRequired: 'Укажите количество гостей',
  guestsRange: `Количество гостей должно быть от ${MIN_GUESTS} до ${MAX_GUESTS}`,
} as const

function isAllowedPhonePrefix(digit: string | undefined): boolean {
  return PHONE_ALLOWED_FIRST_DIGITS.some((allowedDigit) => allowedDigit === digit)
}

function isAllowedTimeSlot(value: string): boolean {
  return TIME_SLOTS.some((slot) => slot === value)
}

function validateName(value: string): string | null {
  const normalizedName = value.trim()

  if (!normalizedName) {
    return ERROR_MESSAGES.nameRequired
  }

  if (normalizedName.length < MIN_NAME_LENGTH) {
    return ERROR_MESSAGES.nameMinLength
  }

  if (!NAME_PATTERN.test(normalizedName)) {
    return ERROR_MESSAGES.nameCharset
  }

  return null
}

function validatePhone(value: string): string | null {
  if (!value.trim()) {
    return ERROR_MESSAGES.phoneRequired
  }

  const rawDigits = value.replace(NON_DIGIT_PATTERN, '')

  if (rawDigits.length !== PHONE_DIGIT_COUNT || !isAllowedPhonePrefix(rawDigits[0])) {
    return ERROR_MESSAGES.phoneFormat
  }

  const normalizedPhone = normalizePhone(value)
  const normalizedPrefix = normalizedPhone[0]

  if (
    normalizedPhone.length !== PHONE_DIGIT_COUNT ||
    !isAllowedPhonePrefix(normalizedPrefix)
  ) {
    return ERROR_MESSAGES.phoneFormat
  }

  return null
}

function validateDate(value: string, context: BookingValidationContext): string | null {
  const dateValue = value.trim()

  if (!dateValue) {
    return ERROR_MESSAGES.dateRequired
  }

  if (!isValidCalendarDate(dateValue)) {
    return ERROR_MESSAGES.dateInvalid
  }

  const today = context.today ?? getTodayDateString()
  const minDate = addDaysToDateString(today, MIN_BOOKING_DATE_OFFSET)
  const maxDate = addDaysToDateString(today, MAX_BOOKING_DATE_OFFSET)

  if (dateValue < minDate) {
    return ERROR_MESSAGES.dateTooEarly
  }

  if (dateValue > maxDate) {
    return ERROR_MESSAGES.dateTooLate
  }

  return null
}

function validateTime(value: string): string | null {
  const timeValue = value.trim()

  if (!timeValue) {
    return ERROR_MESSAGES.timeRequired
  }

  if (!isAllowedTimeSlot(timeValue)) {
    return ERROR_MESSAGES.timeInvalid
  }

  return null
}

function validateGuests(value: number): string | null {
  if (!Number.isInteger(value)) {
    return ERROR_MESSAGES.guestsRequired
  }

  if (value < MIN_GUESTS || value > MAX_GUESTS) {
    return ERROR_MESSAGES.guestsRange
  }

  return null
}

export function validateField(
  field: BookingField,
  value: BookingFormData[BookingField],
  context: BookingValidationContext = {},
): string | null {
  switch (field) {
    case 'name':
      return typeof value === 'string' ? validateName(value) : ERROR_MESSAGES.nameRequired
    case 'phone':
      return typeof value === 'string' ? validatePhone(value) : ERROR_MESSAGES.phoneRequired
    case 'date':
      return typeof value === 'string' ? validateDate(value, context) : ERROR_MESSAGES.dateRequired
    case 'time':
      return typeof value === 'string' ? validateTime(value) : ERROR_MESSAGES.timeRequired
    case 'guests':
      return typeof value === 'number' ? validateGuests(value) : ERROR_MESSAGES.guestsRequired
  }
}

export function validateForm(
  form: BookingFormData,
  context: BookingValidationContext = {},
): BookingErrors {
  const errors: BookingErrors = {}

  for (const field of BOOKING_FIELDS) {
    const message = validateField(field, form[field], context)

    if (message) {
      errors[field] = message
    }
  }

  return errors
}
