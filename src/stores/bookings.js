import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([])
  try { const s = localStorage.getItem('eventus-bookings'); if (s) bookings.value = JSON.parse(s) } catch {}
  function persist() { localStorage.setItem('eventus-bookings', JSON.stringify(bookings.value)) }
  function add({ event, seats, firstName, lastName, email }) {
    const b = { id: Date.now(), eventId: event.id, eventTitle: event.title, eventDate: event.date, eventTime: event.time, eventLocation: event.location, eventCategory: event.category, seats, firstName, lastName, email, bookedAt: new Date().toISOString(), status: 'confirmed' }
    bookings.value = [...bookings.value, b]; persist(); return b
  }
  function edit(id, changes) { bookings.value = bookings.value.map(b => b.id === id ? { ...b, ...changes } : b); persist() }
  function cancel(id) { bookings.value = bookings.value.map(b => b.id === id ? { ...b, status: 'cancelled' } : b); persist() }
  return { bookings, add, edit, cancel }
})
