<script setup lang="ts">
import { computed } from 'vue'
import {
  BOOKING_STATUS,
  RESTAURANT_NAME,
} from '~/constants/booking/booking.constants'
import { useBookingForm } from '~/composables/booking/useBookingForm'

const { status, successfulBooking, reset } = useBookingForm()

const isConfirmationVisible = computed(
  () => status.value === BOOKING_STATUS.success && successfulBooking.value !== null,
)
</script>

<template>
  <main class="page">
    <h1 class="page__title">{{ RESTAURANT_NAME }}</h1>

    <Transition name="booking-screen" mode="out-in">
      <ConfirmationScreen
        v-if="isConfirmationVisible && successfulBooking"
        key="confirmation"
        :booking="successfulBooking"
        @book-again="reset"
      />
      <BookingForm v-else key="form" />
    </Transition>
  </main>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: $spacing-lg;

  @include desktop {
    padding: $spacing-xl;
  }
}

.page__title {
  margin: 0 0 $spacing-lg;
  max-width: 100%;
  font-size: 1.5rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

:deep(.booking-screen-enter-active),
:deep(.booking-screen-leave-active) {
  transition:
    opacity $transition-duration ease,
    transform $transition-duration ease;
}

:deep(.booking-screen-enter-from),
:deep(.booking-screen-leave-to) {
  opacity: 0;
  transform: translateY($transition-offset-y);
}
</style>
