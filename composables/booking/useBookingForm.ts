import { storeToRefs } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { BOOKING_FIELDS } from '~/constants/booking/booking.constants'
import { useBookingSubmit } from '~/composables/booking/useBookingSubmit'
import {
  validateField as getFieldError,
  validateForm as getFormErrors,
} from '~/composables/booking/useBookingValidation'
import { useBookingStore } from '~/stores/booking/booking.store'
import type { BookingErrors, BookingField } from '~/types/booking/booking.types'

function createRevealedFields(): Record<BookingField, boolean> {
  return {
    name: false,
    phone: false,
    date: false,
    time: false,
    guests: false,
  }
}

export function useBookingForm() {
  const bookingStore = useBookingStore()
  const { status, successfulBooking } = storeToRefs(bookingStore)
  const { submit: submitBooking } = useBookingSubmit()

  const errors = ref<BookingErrors>({})
  const revealedFields = reactive(createRevealedFields())

  function revealField(field: BookingField): void {
    revealedFields[field] = true
  }

  function revealAllFields(): void {
    for (const field of BOOKING_FIELDS) {
      revealField(field)
    }
  }

  function resetRevealedFields(): void {
    Object.assign(revealedFields, createRevealedFields())
  }

  function syncFieldError(field: BookingField): string | null {
    const message = getFieldError(field, bookingStore.form[field])
    const nextErrors: BookingErrors = {}

    for (const key of BOOKING_FIELDS) {
      if (key === field) {
        if (message) {
          nextErrors[key] = message
        }

        continue
      }

      const existingMessage = errors.value[key]

      if (existingMessage) {
        nextErrors[key] = existingMessage
      }
    }

    errors.value = nextErrors

    return message
  }

  function syncRevealedFieldErrors(): void {
    for (const field of BOOKING_FIELDS) {
      if (revealedFields[field]) {
        syncFieldError(field)
      }
    }
  }

  function validateField(field: BookingField): string | null {
    revealField(field)

    return syncFieldError(field)
  }

  function validate(): BookingErrors {
    revealAllFields()
    const nextErrors = getFormErrors(bookingStore.form)
    errors.value = nextErrors

    return nextErrors
  }

  function handleBlur(field: BookingField): void {
    validateField(field)
  }

  async function submit(): Promise<void> {
    revealAllFields()
    errors.value = await submitBooking()
  }

  function reset(): void {
    resetRevealedFields()
    errors.value = {}
    bookingStore.reset()
  }

  watch(bookingStore.form, syncRevealedFieldErrors, { deep: true })

  return {
    form: bookingStore.form,
    errors,
    status,
    successfulBooking,
    validateField,
    validate,
    handleBlur,
    submit,
    reset,
  }
}
