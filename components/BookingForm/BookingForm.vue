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
import Button from '~/components/ui/Button/Button.vue'
import DateInput from '~/components/ui/DateInput/DateInput.vue'
import PhoneInput from '~/components/ui/PhoneInput/PhoneInput.vue'
import SelectInput from '~/components/ui/SelectInput/SelectInput.vue'
import TextInput from '~/components/ui/TextInput/TextInput.vue'
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

      <TextInput
        v-model="form.name"
        :field-id="BOOKING_FIELD_IDS.name"
        :label="BOOKING_FIELD_LABELS.name"
        :error="errors.name"
        autocomplete="name"
        @blur="handleBlur('name')"
      />

      <PhoneInput
        v-model="form.phone"
        :field-id="BOOKING_FIELD_IDS.phone"
        :label="BOOKING_FIELD_LABELS.phone"
        :error="errors.phone"
        :placeholder="BOOKING_PHONE_PLACEHOLDER"
        @blur="handleBlur('phone')"
      />

      <div :class="styles.row">
        <DateInput
          v-model="form.date"
          :field-id="BOOKING_FIELD_IDS.date"
          :label="BOOKING_FIELD_LABELS.date"
          :error="errors.date"
          :min="minDate"
          :max="maxDate"
          @blur="handleBlur('date')"
        />

        <SelectInput
          v-model="form.time"
          :field-id="BOOKING_FIELD_IDS.time"
          :label="BOOKING_FIELD_LABELS.time"
          :error="errors.time"
          @blur="handleBlur('time')"
        >
          <option value="" disabled>{{ BOOKING_TIME_PLACEHOLDER }}</option>
          <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </SelectInput>
      </div>

      <SelectInput
        v-model.number="form.guests"
        :field-id="BOOKING_FIELD_IDS.guests"
        :label="BOOKING_FIELD_LABELS.guests"
        :error="errors.guests"
        @blur="handleBlur('guests')"
      >
        <option v-for="guestCount in GUEST_OPTIONS" :key="guestCount" :value="guestCount">
          {{ guestCount }}
        </option>
      </SelectInput>
    </fieldset>

    <Button type="submit" :loading="isLoading" :disabled="isLoading">
      {{ submitLabel }}
    </Button>
  </form>
</template>
