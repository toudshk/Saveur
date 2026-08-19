<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  BOOKING_FIELD_IDS,
  BOOKING_FIELD_LABELS,
  BOOKING_FIELDS,
  BOOKING_FORM_TITLE,
  BOOKING_PHONE_PLACEHOLDER,
  BOOKING_STATUS,
  BOOKING_SUBMIT_LABEL,
  BOOKING_SUBMIT_LOADING_LABEL,
  BOOKING_TIME_PLACEHOLDER,
  GUEST_OPTIONS,
  TIME_SLOTS,
} from '~/constants/booking/booking.constants'
import { useBookingForm } from '~/composables/booking/useBookingForm'
import {
  getMaxBookingDateString,
  getMinBookingDateString,
} from '~/utils/booking/date.utils'
import { formatPhoneInput } from '~/utils/booking/normalizePhone'
import { getFieldErrorId } from '~/utils/booking/getFieldErrorId'
import FormField from './components/FormField.vue'
import styles from './BookingForm.module.scss'

const { form, errors, status, handleBlur, submit } = useBookingForm()

const minDate = ref('')
const maxDate = ref('')
const isLoading = computed(() => status.value === BOOKING_STATUS.loading)
const submitLabel = computed(() =>
  isLoading.value ? BOOKING_SUBMIT_LOADING_LABEL : BOOKING_SUBMIT_LABEL,
)

onMounted(() => {
  minDate.value = getMinBookingDateString()
  maxDate.value = getMaxBookingDateString()
})

function isInvalid(error?: string): boolean {
  return Boolean(error)
}

function describedBy(fieldId: string, error?: string): string | undefined {
  return error ? getFieldErrorId(fieldId) : undefined
}

function focusFirstInvalidField(): void {
  for (const field of BOOKING_FIELDS) {
    if (!errors.value[field]) {
      continue
    }

    document.getElementById(BOOKING_FIELD_IDS[field])?.focus()
    return
  }
}

async function handleSubmit(): Promise<void> {
  await submit()
  focusFirstInvalidField()
}

function handlePhoneInput(event: Event): void {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    return
  }

  form.phone = formatPhoneInput(target.value)
}

function preventLetterInput(event: Event): void {
  if (!(event instanceof InputEvent) || event.inputType !== 'insertText' || !event.data) {
    return
  }

  if (/\p{L}/u.test(event.data)) {
    event.preventDefault()
  }
}
</script>

<template>
  <form
    :class="styles.form"
    novalidate
    :aria-busy="isLoading"
    @submit.prevent="handleSubmit"
  >
    <fieldset :class="styles.fields" :disabled="isLoading">
      <legend :class="styles.legend">{{ BOOKING_FORM_TITLE }}</legend>

      <FormField
        :label="BOOKING_FIELD_LABELS.name"
        :field-id="BOOKING_FIELD_IDS.name"
        :error="errors.name"
      >
        <input
          :id="BOOKING_FIELD_IDS.name"
          v-model="form.name"
          :class="styles.control"
          type="text"
          name="name"
          autocomplete="name"
          required
          :aria-invalid="isInvalid(errors.name)"
          :aria-describedby="describedBy(BOOKING_FIELD_IDS.name, errors.name)"
          @blur="handleBlur('name')"
        />
      </FormField>

      <FormField
        :label="BOOKING_FIELD_LABELS.phone"
        :field-id="BOOKING_FIELD_IDS.phone"
        :error="errors.phone"
      >
        <input
          :id="BOOKING_FIELD_IDS.phone"
          :value="form.phone"
          :class="styles.control"
          type="tel"
          name="phone"
          autocomplete="tel"
          inputmode="numeric"
          maxlength="18"
          required
          :placeholder="BOOKING_PHONE_PLACEHOLDER"
          :aria-invalid="isInvalid(errors.phone)"
          :aria-describedby="describedBy(BOOKING_FIELD_IDS.phone, errors.phone)"
          @beforeinput="preventLetterInput"
          @input="handlePhoneInput"
          @blur="handleBlur('phone')"
        />
      </FormField>

      <div :class="styles.row">
        <FormField
          :label="BOOKING_FIELD_LABELS.date"
          :field-id="BOOKING_FIELD_IDS.date"
          :error="errors.date"
        >
          <input
            :id="BOOKING_FIELD_IDS.date"
            v-model="form.date"
            :class="[styles.control, styles.date]"
            type="date"
            name="date"
            required
            :min="minDate"
            :max="maxDate"
            :aria-invalid="isInvalid(errors.date)"
            :aria-describedby="describedBy(BOOKING_FIELD_IDS.date, errors.date)"
            @beforeinput="preventLetterInput"
            @blur="handleBlur('date')"
          />
        </FormField>

        <FormField
          :label="BOOKING_FIELD_LABELS.time"
          :field-id="BOOKING_FIELD_IDS.time"
          :error="errors.time"
        >
          <select
            :id="BOOKING_FIELD_IDS.time"
            v-model="form.time"
            :class="[styles.control, styles.select]"
            name="time"
            required
            :aria-invalid="isInvalid(errors.time)"
            :aria-describedby="describedBy(BOOKING_FIELD_IDS.time, errors.time)"
            @blur="handleBlur('time')"
          >
            <option value="" disabled>{{ BOOKING_TIME_PLACEHOLDER }}</option>
            <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">
              {{ slot }}
            </option>
          </select>
        </FormField>
      </div>

      <FormField
        :label="BOOKING_FIELD_LABELS.guests"
        :field-id="BOOKING_FIELD_IDS.guests"
        :error="errors.guests"
      >
        <select
          :id="BOOKING_FIELD_IDS.guests"
          v-model.number="form.guests"
          :class="[styles.control, styles.select]"
          name="guests"
          required
          :aria-invalid="isInvalid(errors.guests)"
          :aria-describedby="describedBy(BOOKING_FIELD_IDS.guests, errors.guests)"
          @blur="handleBlur('guests')"
        >
          <option v-for="guestCount in GUEST_OPTIONS" :key="guestCount" :value="guestCount">
            {{ guestCount }}
          </option>
        </select>
      </FormField>
    </fieldset>

    <button :class="styles.submit" type="submit" :disabled="isLoading">
      <span v-if="isLoading" :class="styles.spinner" aria-hidden="true" />
      <span>{{ submitLabel }}</span>
    </button>
  </form>
</template>
