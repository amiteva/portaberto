import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleSwitcher from '@/components/elements/LocaleSwitcher/LocaleSwitcher.vue'
import { i18n, setLocale } from '@/i18n'

describe('LocaleSwitcher', () => {
  it('opens the language menu and switches locale', async () => {
    setLocale('en')

    const wrapper = mount(LocaleSwitcher, {
      global: {
        plugins: [i18n]
      }
    })

    const trigger = wrapper.get('button.locale-switcher__button')
    expect(trigger.text()).toContain('EN')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    expect(wrapper.get('[role="menu"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="menuitemradio"]')).toHaveLength(2)

    await wrapper.findAll('[role="menuitemradio"]')[1].trigger('click')
    await wrapper.vm.$nextTick()

    expect(i18n.global.locale.value).toBe('mk')
    expect(document.documentElement.lang).toBe('mk')
    expect(localStorage.getItem('eventus-locale')).toBe('mk')
    expect(wrapper.get('button.locale-switcher__button').text()).toContain('MK')
    expect(wrapper.get('button.locale-switcher__button').attributes('aria-expanded')).toBe('false')

    setLocale('en')
  })

  it('closes the menu when clicking outside', async () => {
    setLocale('en')

    const wrapper = mount(LocaleSwitcher, {
      attachTo: document.body,
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.get('button.locale-switcher__button').trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('button.locale-switcher__button').attributes('aria-expanded')).toBe('false')
  })
})
