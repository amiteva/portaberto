import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'

describe('BaseButton', () => {
  it('renders a button by default and forwards type', () => {
    const wrapper = mount(BaseButton, {
      props: { type: 'submit' },
      slots: { default: 'Save' }
    })

    const button = wrapper.get('button')
    expect(button.text()).toContain('Save')
    expect(button.attributes('type')).toBe('submit')
  })

  it('disables the button and exposes busy state while loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Send' }
    })

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.sr-only').text()).toBe('Loading')
  })

  it('renders links for href and route targets', () => {
    const external = mount(BaseButton, {
      props: { href: 'https://example.com' },
      slots: { default: 'External' }
    })
    expect(external.get('a').attributes('href')).toBe('https://example.com')

    const route = mount(BaseButton, {
      props: { to: '/favorites' },
      slots: { default: 'Favorites' }
    })
    expect(route.props('to')).toBe('/favorites')
    expect(route.find('button').exists()).toBe(false)
    expect(route.text()).toContain('Favorites')
  })
})
