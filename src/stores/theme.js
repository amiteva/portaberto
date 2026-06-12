import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'portaberto-theme'
const THEMES = ['dark', 'light']

function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return THEMES.includes(stored) ? stored : 'dark'
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref(getStoredTheme())
  const resolvedTheme = computed(() => preference.value)

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', resolvedTheme.value)
  }

  function setPreference(value) {
    const nextTheme = THEMES.includes(value) ? value : 'dark'
    preference.value = nextTheme
    localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  function cycleTheme() {
    const next = preference.value === 'dark' ? 'light' : 'dark'
    setPreference(next)
  }

  function init() {
    setPreference(preference.value)
    applyTheme()
  }

  watch(resolvedTheme, applyTheme)

  return { preference, resolvedTheme, setPreference, cycleTheme, init }
})
