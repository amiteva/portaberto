import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import { useFavoritesStore } from '@/stores/favorites'
import { useVenuesStore } from '@/stores/venues'

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('scopes favorite toggles to the signed-in profile', () => {
    const authStore = useAuthStore()
    const store = useFavoritesStore()

    expect(store.toggle(12)).toBe(false)
    expect(store.isFavorite(12)).toBe(false)

    authStore.login('user')
    store.toggle(12)
    expect(store.isFavorite(12)).toBe(true)
    expect(JSON.parse(localStorage.getItem('eventus-favorites'))).toEqual({ 'user:1': [12] })

    authStore.logout()
    expect(store.isFavorite(12)).toBe(false)

    authStore.login('admin')
    expect(store.isFavorite(12)).toBe(false)
    store.toggle(7)
    expect(store.isFavorite(7)).toBe(true)
    expect(JSON.parse(localStorage.getItem('eventus-favorites'))).toEqual({ 'user:1': [12], 'admin:2': [7] })

    authStore.login('user')
    expect(store.isFavorite(12)).toBe(true)
    expect(store.isFavorite(7)).toBe(false)
    store.toggle(12)
    expect(store.isFavorite(12)).toBe(false)
    expect(JSON.parse(localStorage.getItem('eventus-favorites'))).toEqual({ 'user:1': [], 'admin:2': [7] })
  })

  it('logs users in and out', () => {
    const store = useAuthStore()

    store.login('admin')
    expect(store.isLoggedIn).toBe(true)
    expect(store.isAdmin).toBe(true)
    expect(JSON.parse(localStorage.getItem('eventus-user')).role).toBe('admin')

    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(localStorage.getItem('eventus-user')).toBeNull()
  })

  it('creates and cancels bookings', () => {
    const store = useBookingsStore()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-12T10:00:00.000Z'))

    const booking = store.add({
      event: {
        id: 1,
        title: 'Global Innovation Summit',
        date: '2026-09-01',
        time: '09:00',
        location: 'Stockholm',
        category: 'Conference'
      },
      seats: 2,
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com'
    })

    expect(booking.status).toBe('confirmed')
    expect(store.bookings).toHaveLength(1)

    store.cancel(booking.id)
    expect(store.bookings[0].status).toBe('cancelled')
    expect(JSON.parse(localStorage.getItem('eventus-bookings'))[0].status).toBe('cancelled')

    vi.useRealTimers()
  })

  it('creates and updates venues', () => {
    const store = useVenuesStore()

    const venue = store.create({
      name: 'Admin Hall',
      description: 'A new admin-created venue.',
      capacity: 220,
      type: 'Conference Center',
      amenities: ['Wi-Fi', 'Catering']
    })

    expect(venue.id).toBe(1001)
    expect(store.venues).toHaveLength(1)
    expect(store.venues[0]).toMatchObject({
      name: 'Admin Hall',
      capacity: 220,
      amenities: ['Wi-Fi', 'Catering']
    })

    const updated = store.update(venue.id, {
      name: 'Updated Admin Hall',
      capacity: 260
    })

    expect(updated).toMatchObject({
      name: 'Updated Admin Hall',
      capacity: 260
    })
  })
})
