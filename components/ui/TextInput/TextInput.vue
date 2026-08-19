<script setup lang="ts">
import { computed } from 'vue'
import { getFieldErrorId } from '~/utils/booking/getFieldErrorId'
import FormField from '~/components/ui/FormField/FormField.vue'
import controlStyles from '~/components/ui/styles/control.module.scss'

const props = defineProps<{
  fieldId: string
  label: string
  error?: string
  autocomplete?: string
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
      :class="controlStyles.control"
      type="text"
      :name="name ?? fieldId"
      :autocomplete="autocomplete"
      required
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @blur="$emit('blur')"
    />
  </FormField>
</template>
