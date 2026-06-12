import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'portaberto-bookings'

function bookingOwnerKey(booking) {
  const email = booking.email?.trim().toLowerCase()
  if (email) return email
  return `${booking.firstName ?? ''}:${booking.lastName ?? ''}`.trim().toLowerCase()
}

function bookingKey(booking) {
  return `${Number(booking.eventId)}:${bookingOwnerKey(booking)}`
}

function getBookingTime(booking) {
  const time = Date.parse(booking.updatedAt || booking.bookedAt)
  if (Number.isFinite(time)) return time
  return Number(booking.id) || 0
}

function mergeDuplicateBooking(current, next) {
  const newer = getBookingTime(next) >= getBookingTime(current) ? next : current
  const hasCancelled = current.status === 'cancelled' || next.status === 'cancelled'

  return {
    ...newer,
    status: hasCancelled ? 'cancelled' : newer.status
  }
}

function normalizeBookings(list) {
  const buckets = new Map()

  list.forEach((booking) => {
    const key = bookingKey(booking)
    const existing = buckets.get(key)
    buckets.set(key, existing ? mergeDuplicateBooking(existing, booking) : booking)
  })

  return [...buckets.values()]
}

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([])

  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      const parsed = JSON.parse(s)
      bookings.value = Array.isArray(parsed) ? normalizeBookings(parsed) : []
      if (JSON.stringify(parsed) !== JSON.stringify(bookings.value)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value))
      }
    }
  } catch {}

  function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value)) }

  function add({ event, seats, firstName, lastName, email }) {
    const normalizedEmail = email.trim().toLowerCase()
    const existing = bookings.value.find((booking) => (
      Number(booking.eventId) === Number(event.id) &&
      booking.email?.trim().toLowerCase() === normalizedEmail
    ))
    const nextBooking = {
      id: existing?.id ?? Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventCategory: event.category,
      seats,
      firstName,
      lastName,
      email,
      bookedAt: existing?.bookedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: event.status === 'cancelled' ? 'cancelled' : 'confirmed'
    }

    bookings.value = normalizeBookings(existing
      ? bookings.value.map((booking) => booking.id === existing.id ? nextBooking : booking)
      : [...bookings.value, nextBooking])
    persist()
    return nextBooking
  }

  function edit(id, changes) { bookings.value = normalizeBookings(bookings.value.map(b => b.id === id ? { ...b, ...changes } : b)); persist() }
  function cancel(id) { bookings.value = normalizeBookings(bookings.value.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)); persist() }
  function cancelByEvent(eventId) {
    const numericId = Number(eventId)
    bookings.value = normalizeBookings(bookings.value.map((booking) => (
      Number(booking.eventId) === numericId
        ? { ...booking, status: 'cancelled' }
        : booking
    )))
    persist()
  }

  return { bookings, add, edit, cancel, cancelByEvent }
})
