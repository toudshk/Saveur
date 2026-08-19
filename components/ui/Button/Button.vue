<script setup lang="ts">
import styles from './Button.module.scss'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    loading: false,
    disabled: false,
  },
)
</script>

<template>
  <button
    :class="styles.button"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" :class="styles.spinner" aria-hidden="true" />
    <span><slot /></span>
  </button>
</template>
