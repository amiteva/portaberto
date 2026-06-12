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
    expect(JSON.parse(localStorage.getItem('portaberto-favorites'))).toEqual({ 'user:1': [12] })

    authStore.logout()
    expect(store.isFavorite(12)).toBe(false)

    authStore.login('admin')
    expect(store.isFavorite(12)).toBe(false)
    expect(store.toggle(7)).toBe(false)
    expect(store.isFavorite(7)).toBe(false)
    expect(JSON.parse(localStorage.getItem('portaberto-favorites'))).toEqual({ 'user:1': [12] })

    authStore.login('user')
    expect(store.isFavorite(12)).toBe(true)
    expect(store.isFavorite(7)).toBe(false)
    store.toggle(12)
    expect(store.isFavorite(12)).toBe(false)
    expect(JSON.parse(localStorage.getItem('portaberto-favorites'))).toEqual({ 'user:1': [] })
  })

  it('logs users in and out', () => {
    const store = useAuthStore()

    store.login('admin')
    expect(store.isLoggedIn).toBe(true)
    expect(store.isAdmin).toBe(true)
    expect(JSON.parse(localStorage.getItem('portaberto-user')).role).toBe('admin')

    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(localStorage.getItem('portaberto-user')).toBeNull()
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
    expect(JSON.parse(localStorage.getItem('portaberto-bookings'))[0].status).toBe('cancelled')

    vi.useRealTimers()
  })

  it('keeps one booking per event and email when registering again', () => {
    const store = useBookingsStore()
    const event = {
      id: 4,
      title: 'Future of Technology Conference',
      date: '2026-09-01',
      time: '09:00',
      location: 'Skopje',
      category: 'Conference'
    }

    const first = store.add({
      event,
      seats: 1,
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com'
    })
    const second = store.add({
      event,
      seats: 3,
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com'
    })

    expect(second.id).toBe(first.id)
    expect(store.bookings).toHaveLength(1)
    expect(store.bookings[0]).toMatchObject({
      eventId: 4,
      seats: 3,
      status: 'confirmed'
    })
  })

  it('deduplicates persisted duplicate bookings on load', () => {
    localStorage.setItem('portaberto-bookings', JSON.stringify([
      {
        id: 1,
        eventId: 4,
        eventTitle: 'Future of Technology Conference',
        eventDate: '2026-09-01',
        eventTime: '09:00',
        eventLocation: 'Skopje',
        eventCategory: 'Workshop',
        seats: 2,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
        bookedAt: '2026-06-12T10:00:00.000Z',
        status: 'cancelled'
      },
      {
        id: 2,
        eventId: 4,
        eventTitle: 'Future of Technology Conference',
        eventDate: '2026-09-01',
        eventTime: '09:00',
        eventLocation: 'Skopje',
        eventCategory: 'Workshop',
        seats: 1,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
        bookedAt: '2026-06-12T11:00:00.000Z',
        status: 'confirmed'
      },
      {
        id: 3,
        eventId: 9,
        eventTitle: 'Other Event',
        eventDate: '2026-09-02',
        eventTime: '10:00',
        eventLocation: 'Skopje',
        eventCategory: 'Conference',
        seats: 1,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
        bookedAt: '2026-06-12T12:00:00.000Z',
        status: 'confirmed'
      }
    ]))

    const store = useBookingsStore()

    expect(store.bookings).toHaveLength(2)
    expect(store.bookings.find((booking) => booking.eventId === 4)).toMatchObject({
      id: 2,
      seats: 1,
      status: 'cancelled'
    })
    expect(JSON.parse(localStorage.getItem('portaberto-bookings'))).toHaveLength(2)
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

    store.remove(venue.id)
    expect(store.venues).toHaveLength(0)
  })
})
