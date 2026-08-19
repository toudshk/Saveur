import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useBookingForm } from '~/composables/booking/useBookingForm'
import { BOOKING_STATUS, SUBMIT_DELAY_MS } from '~/constants/booking/booking.constants'
import { getTodayDateString } from '~/utils/booking/date.utils'

function createBookingForm() {
  const scope = effectScope()
  const bookingForm = scope.run(() => useBookingForm())

  if (!bookingForm) {
    throw new Error('Failed to create booking form')
  }

  return {
    bookingForm,
    scope,
  }
}

function fillValidForm(bookingForm: ReturnType<typeof useBookingForm>): void {
  bookingForm.form.name = 'Анна'
  bookingForm.form.phone = '+7 (999) 123-45-67'
  bookingForm.form.date = getTodayDateString()
  bookingForm.form.time = '18:00'
  bookingForm.form.guests = 2
}

describe('useBookingForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a name error after blur and clears it after a valid change', async () => {
    const { bookingForm, scope } = createBookingForm()

    bookingForm.handleBlur('name')
    expect(bookingForm.errors.value.name).toBeTruthy()

    bookingForm.form.name = 'Анна'
    await nextTick()
    expect(bookingForm.errors.value.name).toBeUndefined()

    scope.stop()
  })

  it('does not start submit when the form is invalid', async () => {
    const { bookingForm, scope } = createBookingForm()

    await bookingForm.submit()

    expect(bookingForm.status.value).toBe(BOOKING_STATUS.idle)
    expect(bookingForm.errors.value.name).toBeTruthy()
    expect(bookingForm.successfulBooking.value).toBeNull()

    scope.stop()
  })

  it('sets loading while the request is in progress', async () => {
    const { bookingForm, scope } = createBookingForm()
    fillValidForm(bookingForm)

    const submitPromise = bookingForm.submit()
    await nextTick()

    expect(bookingForm.status.value).toBe(BOOKING_STATUS.loading)

    await vi.advanceTimersByTimeAsync(SUBMIT_DELAY_MS)
    await submitPromise
    scope.stop()
  })

  it('saves a successful booking after the delay', async () => {
    const { bookingForm, scope } = createBookingForm()
    fillValidForm(bookingForm)

    const submitPromise = bookingForm.submit()
    await vi.advanceTimersByTimeAsync(SUBMIT_DELAY_MS)
    await submitPromise

    expect(bookingForm.status.value).toBe(BOOKING_STATUS.success)
    expect(bookingForm.successfulBooking.value).toMatchObject({
      name: 'Анна',
      date: getTodayDateString(),
      time: '18:00',
      guests: 2,
    })

    scope.stop()
  })

  it('ignores a repeated submit while loading', async () => {
    const { bookingForm, scope } = createBookingForm()
    fillValidForm(bookingForm)

    const firstSubmit = bookingForm.submit()
    await nextTick()
    expect(bookingForm.status.value).toBe(BOOKING_STATUS.loading)

    const secondSubmit = bookingForm.submit()
    await vi.advanceTimersByTimeAsync(SUBMIT_DELAY_MS)
    await Promise.all([firstSubmit, secondSubmit])

    expect(bookingForm.status.value).toBe(BOOKING_STATUS.success)

    scope.stop()
  })

  it('resets form, status, errors and confirmation', async () => {
    const { bookingForm, scope } = createBookingForm()
    fillValidForm(bookingForm)

    const submitPromise = bookingForm.submit()
    await vi.advanceTimersByTimeAsync(SUBMIT_DELAY_MS)
    await submitPromise

    bookingForm.reset()

    expect(bookingForm.status.value).toBe(BOOKING_STATUS.idle)
    expect(bookingForm.form.name).toBe('')
    expect(bookingForm.form.phone).toBe('')
    expect(bookingForm.form.date).toBe('')
    expect(bookingForm.form.time).toBe('')
    expect(bookingForm.form.guests).toBe(1)
    expect(bookingForm.successfulBooking.value).toBeNull()
    expect(bookingForm.errors.value).toEqual({})

    scope.stop()
  })
})
