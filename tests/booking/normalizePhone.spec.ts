import { describe, expect, it } from 'vitest'
import { formatPhoneInput, normalizePhone } from '~/utils/booking/normalizePhone'

describe('normalizePhone', () => {
  it('keeps a +7 number as 11 digits starting with 7', () => {
    expect(normalizePhone('+79991234567')).toBe('79991234567')
  })

  it('converts an 8XXXXXXXXXX number to a 7 prefix', () => {
    expect(normalizePhone('89991234567')).toBe('79991234567')
  })

  it('strips spaces, parentheses and hyphens', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
    expect(normalizePhone('8 (999) 123-45-67')).toBe('79991234567')
  })

  it('returns digits as-is when the number is incomplete', () => {
    expect(normalizePhone('999123')).toBe('999123')
  })
})

describe('formatPhoneInput', () => {
  it('formats a complete number as +7 (XXX) XXX-XX-XX', () => {
    expect(formatPhoneInput('9098101212')).toBe('+7 (909) 810-12-12')
    expect(formatPhoneInput('89098101212')).toBe('+7 (909) 810-12-12')
    expect(formatPhoneInput('+79098101212')).toBe('+7 (909) 810-12-12')
  })

  it('formats digits as they are typed', () => {
    expect(formatPhoneInput('')).toBe('')
    expect(formatPhoneInput('9')).toBe('+7 (9')
    expect(formatPhoneInput('909')).toBe('+7 (909)')
    expect(formatPhoneInput('909810')).toBe('+7 (909) 810')
    expect(formatPhoneInput('90981012')).toBe('+7 (909) 810-12')
  })
})
