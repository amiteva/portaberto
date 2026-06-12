import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/elements/BaseInput/BaseInput.vue'

describe('BaseInput', () => {
  it('raises temporal labels even before a value is selected', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Start date',
        type: 'date'
      }
    })

    expect(wrapper.find('label').classes()).toContain('input__label--raised')
  })

  it('emits model updates', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Event name'
      }
    })

    await wrapper.find('input').setValue('Annual summit')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Annual summit'])
  })
})
