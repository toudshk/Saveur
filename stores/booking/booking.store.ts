import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { BOOKING_STATUS, MIN_GUESTS } from '~/constants/booking/booking.constants'
import type {
  BookingFormData,
  BookingStatus,
  SuccessfulBooking,
} from '~/types/booking/booking.types'

function createInitialForm(): BookingFormData {
  return {
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: MIN_GUESTS,
  }
}

export const useBookingStore = defineStore('booking', () => {
  const form = reactive<BookingFormData>(createInitialForm())
  const status = ref<BookingStatus>(BOOKING_STATUS.idle)
  const successfulBooking = ref<SuccessfulBooking | null>(null)

  function setStatus(nextStatus: BookingStatus): void {
    status.value = nextStatus
  }

  function setSuccessfulBooking(booking: SuccessfulBooking): void {
    successfulBooking.value = booking
  }

  function reset(): void {
    Object.assign(form, createInitialForm())
    status.value = BOOKING_STATUS.idle
    successfulBooking.value = null
  }

  return {
    form,
    status,
    successfulBooking,
    setStatus,
    setSuccessfulBooking,
    reset,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBookingStore, import.meta.hot))
}
