<template>
  <div class="spinner" :style="{ '--size': size }" role="status" :aria-label="label">
    <svg viewBox="0 0 50 50" class="spinner__svg" aria-hidden="true">
      <circle
        class="spinner__track"
        cx="25" cy="25" r="20"
        fill="none"
        stroke-width="3"
      />
      <circle
        class="spinner__arc"
        cx="25" cy="25" r="20"
        fill="none"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span class="spinner__label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  size:  { type: String, default: '2.5rem' },
  label: { type: String, default: 'Loading…' }
})
</script>

<style lang="scss" scoped>
@import './LoadingSpinner.scss';
</style>
