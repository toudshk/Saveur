import { PHONE_DIGIT_COUNT } from '~/constants/booking/booking.constants'

const NON_DIGIT_PATTERN = /\D/g
const COUNTRY_CODE = '7'
const TRUNK_PREFIX = '8'
const LOCAL_NUMBER_LENGTH = 10

function digitsOnly(value: string): string {
  return value.replace(NON_DIGIT_PATTERN, '')
}

export function normalizePhone(value: string): string {
  const digits = digitsOnly(value)

  if (digits.length === PHONE_DIGIT_COUNT && digits.startsWith(TRUNK_PREFIX)) {
    return `${COUNTRY_CODE}${digits.slice(1)}`
  }

  if (digits.length === LOCAL_NUMBER_LENGTH) {
    return `${COUNTRY_CODE}${digits}`
  }

  return digits
}

function toMaskedPhoneDigits(value: string): string {
  const digits = digitsOnly(value)

  if (digits.length === 0) {
    return ''
  }

  if (digits.startsWith(TRUNK_PREFIX)) {
    return `${COUNTRY_CODE}${digits.slice(1)}`.slice(0, PHONE_DIGIT_COUNT)
  }

  if (digits.startsWith(COUNTRY_CODE)) {
    return digits.slice(0, PHONE_DIGIT_COUNT)
  }

  return `${COUNTRY_CODE}${digits}`.slice(0, PHONE_DIGIT_COUNT)
}

export function formatPhoneInput(value: string): string {
  const digits = toMaskedPhoneDigits(value)

  if (digits.length === 0) {
    return ''
  }

  const area = digits.slice(1, 4)
  const firstBlock = digits.slice(4, 7)
  const secondBlock = digits.slice(7, 9)
  const thirdBlock = digits.slice(9, 11)

  let formatted = `+${digits.slice(0, 1)}`

  if (area.length > 0) {
    formatted += ` (${area}`
  }

  if (area.length === 3) {
    formatted += ')'
  }

  if (firstBlock.length > 0) {
    formatted += ` ${firstBlock}`
  }

  if (secondBlock.length > 0) {
    formatted += `-${secondBlock}`
  }

  if (thirdBlock.length > 0) {
    formatted += `-${thirdBlock}`
  }

  return formatted
}
