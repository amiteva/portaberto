import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchEvents, fetchSpeakers } from '@/services/fakerApi'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const speakers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Enrich events with their matching speaker
  const enrichedEvents = computed(() =>
    events.value.map((event, i) => ({
      ...event,
      speaker: speakers.value[i] ?? null
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
      if (events.value.length) {
        const existingIds = new Set(events.value.map((event) => event.id))
        events.value = [
          ...events.value,
          ...eventsData.filter((event) => !existingIds.has(event.id))
        ]
      } else {
        events.value = eventsData
      }
      speakers.value = speakersData
    } catch (err) {
      error.value = err.message ?? 'Failed to load events.'
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
      category: payload.category || 'Conference',
      images: payload.images?.length ? payload.images : [fallbackImage],
      venueImage: payload.venueImage || payload.images?.[0] || fallbackImage
    }
  }

  function create(payload) {
    const event = buildEvent(payload)
    events.value = [event, ...events.value]
    return event
  }

  function update(id, changes) {
    const numericId = Number(id)
    events.value = events.value.map((event) => (
      event.id === numericId
        ? buildEvent({ ...event, ...changes, id: event.id })
        : event
    ))
    return getById(numericId)
  }

  return { enrichedEvents, loading, error, load, reload, getById, create, update }
})
