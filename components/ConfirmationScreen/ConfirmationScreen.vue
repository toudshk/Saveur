<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  BOOKING_FIELD_LABELS,
  CONFIRMATION_BOOK_AGAIN_LABEL,
  CONFIRMATION_TITLE,
  CONFIRMATION_TITLE_ID,
} from '~/constants/booking/booking.constants'
import type { SuccessfulBooking } from '~/types/booking/booking.types'
import styles from './ConfirmationScreen.module.scss'

defineProps<{
  booking: SuccessfulBooking
}>()

const emit = defineEmits<{
  bookAgain: []
}>()

const titleElement = ref<HTMLHeadingElement | null>(null)

function formatDisplayDate(date: string): string {
  const [year, month, day] = date.split('-')

  if (!year || !month || !day) {
    return date
  }

  return `${day}.${month}.${year}`
}

onMounted(() => {
  titleElement.value?.focus()
})
</script>

<template>
  <section :class="styles.card" :aria-labelledby="CONFIRMATION_TITLE_ID">
    <div :class="styles.icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <path
          d="M8 12.5L10.5 15L16 9.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h2
      :id="CONFIRMATION_TITLE_ID"
      ref="titleElement"
      :class="styles.title"
      tabindex="-1"
    >
      {{ CONFIRMATION_TITLE }}
    </h2>

    <dl :class="styles.details">
      <div :class="styles.row">
        <dt :class="styles.label">{{ BOOKING_FIELD_LABELS.name }}</dt>
        <dd :class="styles.value">{{ booking.name }}</dd>
      </div>
      <div :class="styles.row">
        <dt :class="styles.label">{{ BOOKING_FIELD_LABELS.date }}</dt>
        <dd :class="styles.value">{{ formatDisplayDate(booking.date) }}</dd>
      </div>
      <div :class="styles.row">
        <dt :class="styles.label">{{ BOOKING_FIELD_LABELS.time }}</dt>
        <dd :class="styles.value">{{ booking.time }}</dd>
      </div>
      <div :class="styles.row">
        <dt :class="styles.label">{{ BOOKING_FIELD_LABELS.guests }}</dt>
        <dd :class="styles.value">{{ booking.guests }}</dd>
      </div>
    </dl>

    <button :class="styles.button" type="button" @click="emit('bookAgain')">
      {{ CONFIRMATION_BOOK_AGAIN_LABEL }}
    </button>
  </section>
</template>
