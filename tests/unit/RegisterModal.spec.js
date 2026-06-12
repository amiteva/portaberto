import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterModal from '@/components/events/RegisterModal/RegisterModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'

const event = {
  id: 1,
  title: 'Global Innovation Summit',
  date: '2026-09-01',
  time: '09:00',
  location: 'Skopje, North Macedonia',
  category: 'Conference'
}

function mountModal(props = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(RegisterModal, {
    props: {
      modelValue: true,
      event,
      ...props
    },
    global: {
      plugins: [pinia],
      stubs: {
        Teleport: true
      }
    }
  })
}

describe('RegisterModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows validation errors when required fields are missing', async () => {
    const wrapper = mountModal()

    await wrapper.get('form').trigger('submit')

    const alerts = wrapper.findAll('[role="alert"]').map((node) => node.text())
    expect(alerts).toContain('You must accept the terms.')
    expect(wrapper.text()).toContain('First name is required.')
    expect(wrapper.text()).toContain('Last name is required.')
    expect(wrapper.text()).toContain('Enter a valid email address.')
  })

  it('prefills from the signed-in user when opened', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore().login('user')

    const wrapper = mount(RegisterModal, {
      props: {
        modelValue: false,
        event
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    await wrapper.setProps({ modelValue: true })

    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.value).toBe('Alex')
    expect(inputs[1].element.value).toBe('Morgan')
    expect(inputs[2].element.value).toBe('alex@demo.com')
  })

  it('creates a booking after a valid registration', async () => {
    const wrapper = mountModal()
    const bookingsStore = useBookingsStore()
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Alex')
    await inputs[1].setValue('Morgan')
    await inputs[2].setValue('alex@example.com')
    await inputs[3].setValue(3)
    await inputs[4].setValue(true)
    await wrapper.get('form').trigger('submit')

    await vi.advanceTimersByTimeAsync(800)
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(bookingsStore.bookings).toHaveLength(1)
    expect(bookingsStore.bookings[0]).toMatchObject({
      eventId: 1,
      eventTitle: 'Global Innovation Summit',
      seats: 3,
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com',
      status: 'confirmed'
    })
  })
})
