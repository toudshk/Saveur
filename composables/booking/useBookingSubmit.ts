import { BOOKING_STATUS, SUBMIT_DELAY_MS } from '~/constants/booking/booking.constants'
import { validateForm } from '~/composables/booking/useBookingValidation'
import { useBookingStore } from '~/stores/booking/booking.store'
import type {
  BookingErrors,
  BookingFormData,
  SuccessfulBooking,
} from '~/types/booking/booking.types'
import { normalizePhone } from '~/utils/booking/normalizePhone'

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs)
  })
}

function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0
}

function isConfirmedForm(form: BookingFormData): form is SuccessfulBooking {
  return form.time !== ''
}

function createSuccessfulBooking(form: BookingFormData): SuccessfulBooking | null {
  if (!isConfirmedForm(form)) {
    return null
  }

  return {
    name: form.name.trim(),
    phone: normalizePhone(form.phone),
    date: form.date,
    time: form.time,
    guests: form.guests,
  }
}

export function useBookingSubmit() {
  const bookingStore = useBookingStore()

  async function submit(): Promise<BookingErrors> {
    const currentStatus = bookingStore.status

    if (currentStatus === BOOKING_STATUS.loading) {
      return {}
    }

    const errors = validateForm(bookingStore.form)

    if (hasErrors(errors)) {
      return errors
    }

    bookingStore.setStatus(BOOKING_STATUS.loading)

    await wait(SUBMIT_DELAY_MS)

    if (bookingStore.status !== BOOKING_STATUS.loading) {
      return {}
    }

    const successfulBooking = createSuccessfulBooking(bookingStore.form)

    if (!successfulBooking) {
      bookingStore.setStatus(BOOKING_STATUS.idle)
      return errors
    }

    bookingStore.setSuccessfulBooking(successfulBooking)
    bookingStore.setStatus(BOOKING_STATUS.success)

    return {}
  }

  return {
    submit,
  }
}
