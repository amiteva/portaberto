import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextarea from '@/components/elements/BaseTextarea/BaseTextarea.vue'

describe('BaseTextarea', () => {
  it('emits model updates from user input', async () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        label: 'Additional notes'
      }
    })

    await wrapper.get('textarea').setValue('Vegetarian catering preferred')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Vegetarian catering preferred'])
  })

  it('raises the label when focused or populated', async () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        label: 'Message'
      }
    })

    expect(wrapper.get('label').classes()).not.toContain('textarea__label--raised')

    await wrapper.get('textarea').trigger('focus')
    expect(wrapper.get('label').classes()).toContain('textarea__label--raised')

    await wrapper.get('textarea').trigger('blur')
    await wrapper.setProps({ modelValue: 'Existing message' })
    expect(wrapper.get('label').classes()).toContain('textarea__label--raised')
  })

  it('renders validation errors as alerts', () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        label: 'Message',
        error: 'Message is required.'
      }
    })

    expect(wrapper.get('[role="alert"]').text()).toBe('Message is required.')
    expect(wrapper.get('.textarea__wrapper').classes()).toContain('textarea__wrapper--error')
  })
})
