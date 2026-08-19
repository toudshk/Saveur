<script setup lang="ts">
import { computed } from 'vue'
import { getFieldErrorId } from '~/utils/booking/getFieldErrorId'
import { preventLetterInput } from '~/utils/dom/preventLetterInput'
import { formatPhoneInput } from '~/utils/booking/normalizePhone'
import FormField from '~/components/ui/FormField/FormField.vue'
import controlStyles from '~/components/ui/styles/control.module.scss'

const props = defineProps<{
  fieldId: string
  label: string
  error?: string
  placeholder?: string
  name?: string
}>()

const model = defineModel<string>({ required: true })

defineEmits<{
  blur: []
}>()

const describedBy = computed(() => (props.error ? getFieldErrorId(props.fieldId) : undefined))

function handleInput(event: Event): void {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    return
  }

  model.value = formatPhoneInput(target.value)
}
</script>

<template>
  <FormField :label="label" :field-id="fieldId" :error="error">
    <input
      :id="fieldId"
      :value="model"
      :class="controlStyles.control"
      type="tel"
      :name="name ?? fieldId"
      autocomplete="tel"
      inputmode="numeric"
      maxlength="18"
      required
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @beforeinput="preventLetterInput"
      @input="handleInput"
      @blur="$emit('blur')"
    />
  </FormField>
</template>
