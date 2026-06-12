import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EventFilters from '@/components/events/EventFilters/EventFilters.vue'
import { i18n, setLocale } from '@/i18n'

function mountFilters(props = {}) {
  setLocale('en')
  return mount(EventFilters, {
    props: {
      search: '',
      category: 'All',
      sort: 'date-asc',
      ...props
    },
    global: {
      plugins: [i18n]
    }
  })
}

describe('EventFilters', () => {
  it('emits search updates and can clear the search field', async () => {
    const wrapper = mountFilters()

    await wrapper.get('input[type="search"]').setValue('summit')

    expect(wrapper.emitted('update:search')?.[0]).toEqual(['summit'])

    await wrapper.get('.filters__search-clear').trigger('click')

    expect(wrapper.emitted('update:search')?.at(-1)).toEqual([''])
    expect(wrapper.get('input[type="search"]').element.value).toBe('')
  })

  it('emits category and sort updates', async () => {
    const wrapper = mountFilters()

    await wrapper.get('button[aria-pressed="false"]').trigger('click')
    expect(wrapper.emitted('update:category')?.[0]).toEqual(['Conference'])

    await wrapper.get('select').setValue('price-desc')
    expect(wrapper.emitted('update:sort')?.[0]).toEqual(['price-desc'])
  })

  it('keeps the local search field in sync with prop changes', async () => {
    const wrapper = mountFilters({ search: 'expo' })

    expect(wrapper.get('input[type="search"]').element.value).toBe('expo')

    await wrapper.setProps({ search: 'gala' })

    expect(wrapper.get('input[type="search"]').element.value).toBe('gala')
  })
})
