<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :aria-disabled="disabled || loading || undefined"
    :aria-busy="loading || undefined"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--full': fullWidth, 'btn--loading': loading }
    ]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <span v-if="loading" class="sr-only">Loading</span>
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:   { type: String, default: 'primary' },  // primary | outlined
  size:      { type: String, default: 'md' },        // sm | md | lg
  fullWidth: { type: Boolean, default: false },
  loading:   { type: Boolean, default: false },
  disabled:  { type: Boolean, default: false },
  type:      { type: String, default: 'button' },
  to:        { type: [String, Object], default: null },
  href:      { type: String, default: null }
})

const tag = computed(() => {
  if (props.to) return 'RouterLink'
  if (props.href) return 'a'
  return 'button'
})
</script>

<style lang="scss" scoped>
@import './BaseButton.scss';
</style>
