<script setup lang="ts">
import { computed } from 'vue'
import { getFieldErrorId } from '~/utils/booking/getFieldErrorId'
import styles from './FormField.module.scss'

const props = defineProps<{
  label: string
  fieldId: string
  error?: string
}>()

const errorId = computed(() => getFieldErrorId(props.fieldId))
</script>

<template>
  <div :class="styles.field">
    <label :class="styles.label" :for="fieldId">{{ label }}</label>
    <slot />
    <p v-if="error" :id="errorId" :class="styles.error">{{ error }}</p>
  </div>
</template>
