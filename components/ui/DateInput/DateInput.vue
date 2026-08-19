<script setup lang="ts">
import { computed } from 'vue'
import { getFieldErrorId } from '~/utils/booking/getFieldErrorId'
import { openDatePicker } from '~/utils/dom/openDatePicker'
import { preventLetterInput } from '~/utils/dom/preventLetterInput'
import FormField from '~/components/ui/FormField/FormField.vue'
import controlStyles from '~/components/ui/styles/control.module.scss'

const props = defineProps<{
  fieldId: string
  label: string
  error?: string
  min?: string
  max?: string
  name?: string
}>()

const model = defineModel<string>({ required: true })

defineEmits<{
  blur: []
}>()

const describedBy = computed(() => (props.error ? getFieldErrorId(props.fieldId) : undefined))
</script>

<template>
  <FormField :label="label" :field-id="fieldId" :error="error">
    <input
      :id="fieldId"
      v-model="model"
      :class="[controlStyles.control, controlStyles.date]"
      type="date"
      :name="name ?? fieldId"
      required
      :min="min"
      :max="max"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @click="openDatePicker"
      @beforeinput="preventLetterInput"
      @blur="$emit('blur')"
    />
  </FormField>
</template>
