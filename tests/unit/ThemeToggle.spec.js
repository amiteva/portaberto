import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ThemeToggle from '@/components/elements/ThemeToggle/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('defaults to dark and cycles only between dark and light', async () => {
    const wrapper = mount(ThemeToggle, {
      global: {
        plugins: [createPinia()]
      }
    })
    const store = useThemeStore()

    expect(store.preference).toBe('dark')
    expect(wrapper.get('button').attributes('aria-label')).toContain('current: dark')

    await wrapper.get('button').trigger('click')
    expect(store.preference).toBe('light')
    expect(localStorage.getItem('portaberto-theme')).toBe('light')

    await wrapper.get('button').trigger('click')
    expect(store.preference).toBe('dark')
    expect(localStorage.getItem('portaberto-theme')).toBe('dark')
  })

  it('migrates invalid saved preferences to dark', () => {
    localStorage.setItem('portaberto-theme', 'system')
    const store = useThemeStore()

    store.init()

    expect(store.preference).toBe('dark')
    expect(localStorage.getItem('portaberto-theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
