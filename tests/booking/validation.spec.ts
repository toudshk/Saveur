import { describe, expect, it } from 'vitest'
import { validateField } from '~/composables/booking/useBookingValidation'
import { addDaysToDateString } from '~/utils/booking/date.utils'

const TODAY = '2026-08-19'
const DATE_CONTEXT = { today: TODAY }

describe('validateField name', () => {
  it('rejects an empty value', () => {
    expect(validateField('name', '')).not.toBeNull()
  })

  it('rejects a single character', () => {
    expect(validateField('name', 'A')).not.toBeNull()
  })

  it('accepts a valid name', () => {
    expect(validateField('name', 'Анна')).toBeNull()
  })

  it('rejects digits', () => {
    expect(validateField('name', 'Anna1')).not.toBeNull()
  })

  it('accepts a hyphen between letters', () => {
    expect(validateField('name', 'Анна-Мария')).toBeNull()
  })

  it('accepts Russian letters', () => {
    expect(validateField('name', 'Иван')).toBeNull()
  })

  it('accepts Latin letters', () => {
    expect(validateField('name', 'John')).toBeNull()
  })
})

describe('validateField phone', () => {
  it('accepts +7XXXXXXXXXX', () => {
    expect(validateField('phone', '+79991234567')).toBeNull()
  })

  it('accepts 8XXXXXXXXXX', () => {
    expect(validateField('phone', '89991234567')).toBeNull()
  })

  it('accepts a formatted phone', () => {
    expect(validateField('phone', '+7 (999) 123-45-67')).toBeNull()
    expect(validateField('phone', '+7 (909) 810-12-12')).toBeNull()
  })

  it('rejects an invalid phone', () => {
    expect(validateField('phone', 'not-a-phone')).not.toBeNull()
  })

  it('rejects too few digits', () => {
    expect(validateField('phone', '8999123456')).not.toBeNull()
  })

  it('rejects a wrong prefix', () => {
    expect(validateField('phone', '19991234567')).not.toBeNull()
  })
})

describe('validateField date', () => {
  it('rejects an empty value', () => {
    expect(validateField('date', '', DATE_CONTEXT)).not.toBeNull()
  })

  it('accepts today', () => {
    expect(validateField('date', TODAY, DATE_CONTEXT)).toBeNull()
  })

  it('rejects yesterday', () => {
    expect(validateField('date', addDaysToDateString(TODAY, -1), DATE_CONTEXT)).not.toBeNull()
  })

  it('accepts today + 90 days', () => {
    expect(validateField('date', addDaysToDateString(TODAY, 90), DATE_CONTEXT)).toBeNull()
  })

  it('rejects today + 91 days', () => {
    expect(validateField('date', addDaysToDateString(TODAY, 91), DATE_CONTEXT)).not.toBeNull()
  })
})

describe('validateField time', () => {
  it('accepts a valid slot', () => {
    expect(validateField('time', '18:00')).toBeNull()
  })

  it('rejects an invalid slot', () => {
    expect(validateField('time', '12:30')).not.toBeNull()
  })
})

describe('validateField guests', () => {
  it('rejects 0', () => {
    expect(validateField('guests', 0)).not.toBeNull()
  })

  it('accepts 1', () => {
    expect(validateField('guests', 1)).toBeNull()
  })

  it('accepts 12', () => {
    expect(validateField('guests', 12)).toBeNull()
  })

  it('rejects 13', () => {
    expect(validateField('guests', 13)).not.toBeNull()
  })

  it('rejects a non-integer', () => {
    expect(validateField('guests', 1.5)).not.toBeNull()
  })
})
