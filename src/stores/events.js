import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchEvents, fetchSpeakers } from '@/services/fakerApi'
import { useBookingsStore } from '@/stores/bookings'

const STORAGE_KEY = 'portaberto-events'

function normalizeEventId(id) {
  const numericId = Number(id)
  return Number.isFinite(numericId) ? numericId : id
}

function readStoredEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored)
      ? stored.filter((event) => event?.id !== undefined)
      : []
  } catch {
    return []
  }
}

function persistStoredEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

function mergeStoredEvents(baseEvents, storedEvents) {
  const storedById = new Map(
    storedEvents.map((event) => [normalizeEventId(event.id), { ...event, id: normalizeEventId(event.id) }])
  )

  const mergedBaseEvents = baseEvents.map((event) => {
    const id = normalizeEventId(event.id)
    const stored = storedById.get(id)
    storedById.delete(id)
    return stored ? { ...event, ...stored, id } : { ...event, id }
  })

  return [...storedById.values(), ...mergedBaseEvents]
}

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const speakers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const bookingsStore = useBookingsStore()

  function getEventSpeakers(event, index) {
    if (Array.isArray(event.speakers)) return event.speakers
    if (event.speaker) return [event.speaker]
    return speakers.value[index] ? [speakers.value[index]] : []
  }

  const enrichedEvents = computed(() =>
    events.value.map((event, i) => ({
      ...event,
      speakers: getEventSpeakers(event, i),
      speaker: getEventSpeakers(event, i)[0] ?? null
    }))
  )

  async function load() {
    if (events.value.length) return // already loaded
    loading.value = true
    error.value = null
    try {
      const [eventsData, speakersData] = await Promise.all([
        fetchEvents(20),
        fetchSpeakers(20)
      ])
      const storedEvents = readStoredEvents()
      if (events.value.length) {
        const existingIds = new Set(events.value.map((event) => event.id))
        events.value = mergeStoredEvents([
          ...events.value,
          ...eventsData.filter((event) => !existingIds.has(event.id))
        ], storedEvents)
      } else {
        events.value = mergeStoredEvents(eventsData, storedEvents)
      }
      speakers.value = speakersData
    } catch (err) {
      error.value = err.message ?? 'Failed to load events.'
      events.value = readStoredEvents()
    } finally {
      loading.value = false
    }
  }

  async function reload() {
    events.value = []
    speakers.value = []
    await load()
  }

  function getById(id) {
    return enrichedEvents.value.find((e) => e.id === Number(id)) ?? null
  }

  function buildEvent(payload) {
    const id = payload.id ?? Math.max(1000, ...events.value.map((event) => Number(event.id) || 0)) + 1
    const fallbackImage = `https://picsum.photos/seed/admin-event-${id}/1200/600`

    return {
      id,
      title: payload.title?.trim() || 'Untitled Event',
      description: payload.description?.trim() || 'No description available.',
      date: payload.date || new Date().toISOString().slice(0, 10),
      time: payload.time || '09:00',
      price: Number(payload.price) || 0,
      capacity: Number(payload.capacity) || 0,
      location: payload.location?.trim() || 'TBD',
      venueId: payload.venueId ?? null,
      venueName: payload.venueName ?? '',
      category: payload.category || 'Conference',
      images: payload.images?.length ? payload.images : [fallbackImage],
      venueImage: payload.venueImage || payload.images?.[0] || fallbackImage,
      speakers: Array.isArray(payload.speakers) ? payload.speakers : [],
      status: payload.status || 'active'
    }
  }

  function create(payload) {
    const event = buildEvent(payload)
    events.value = [event, ...events.value]
    persistStoredEvents(events.value)
    return event
  }

  function update(id, changes) {
    const numericId = Number(id)
    events.value = events.value.map((event) => (
      event.id === numericId
        ? buildEvent({ ...event, ...changes, id: event.id })
        : event
    ))
    const event = getById(numericId)
    persistStoredEvents(events.value)
    return event
  }

  function cancel(id) {
    const event = update(id, { status: 'cancelled' })
    bookingsStore.cancelByEvent(id)
    return event
  }

  function cancelByVenue(venue) {
    const venueId = Number(venue?.id)
    const venueName = venue?.name?.trim().toLowerCase()
    if (!Number.isFinite(venueId) && !venueName) return []

    const cancelled = []
    events.value = events.value.map((event) => {
      const eventVenueId = Number(event.venueId)
      const eventVenueName = event.venueName?.trim().toLowerCase()
      const eventLocation = event.location?.trim().toLowerCase()
      const isHostedAtVenue =
        (Number.isFinite(venueId) && eventVenueId === venueId) ||
        (!!venueName && (eventVenueName === venueName || eventLocation === venueName))

      if (!isHostedAtVenue || event.status === 'cancelled') return event

      const nextEvent = { ...event, status: 'cancelled' }
      cancelled.push(nextEvent)
      bookingsStore.cancelByEvent(event.id)
      return nextEvent
    })

    if (cancelled.length) persistStoredEvents(events.value)
    return cancelled
  }

  return { enrichedEvents, loading, error, load, reload, getById, create, update, cancel, cancelByVenue }
})
