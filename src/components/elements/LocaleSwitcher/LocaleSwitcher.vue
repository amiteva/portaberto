<template>
  <div
    ref="rootRef"
    class="locale-switcher"
    @keydown.escape.stop.prevent="open = false"
  >
    <button
      type="button"
      class="locale-switcher__button"
      :class="{ 'locale-switcher__button--open': open }"
      :aria-label="`${t('a11y.chooseLanguage')}: ${activeLocale.label}`"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
      @keydown.down.prevent="open = true"
    >
      <span>{{ activeLocale.shortLabel }}</span>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <path d="M5 8l5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="locale-menu">
      <div
        v-if="open"
        class="locale-switcher__menu"
        role="menu"
        :aria-label="t('a11y.chooseLanguage')"
      >
        <button
          v-for="option in SUPPORTED_LOCALES"
          :key="option.code"
          type="button"
          class="locale-switcher__option"
          :class="{ 'locale-switcher__option--active': locale === option.code }"
          role="menuitemradio"
          :aria-checked="locale === option.code"
          @click="chooseLocale(option.code)"
        >
          <span class="locale-switcher__option-code">{{ option.shortLabel }}</span>
          <span class="locale-switcher__option-label">{{ option.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale } from '@/i18n'

const { locale, t } = useI18n()

const open = ref(false)
const rootRef = ref(null)

const activeLocale = computed(() => {
  return SUPPORTED_LOCALES.find((option) => option.code === locale.value) ?? SUPPORTED_LOCALES[0]
})

function chooseLocale(code) {
  setLocale(code)
  open.value = false
}

function onDocumentPointerDown(event) {
  if (!rootRef.value?.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<style lang="scss" scoped>
@import './LocaleSwitcher.scss';
</style>
