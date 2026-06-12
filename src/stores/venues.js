import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPlaces } from '@/services/fakerApi'

export const useVenuesStore = defineStore('venues', () => {
  const venues  = ref([])
  const loading = ref(false)
  const error   = ref(null)

  async function load() {
    if (venues.value.length) return
    loading.value = true
    error.value = null
    try {
      const venuesData = await fetchPlaces(12)
      if (venues.value.length) {
        const existingIds = new Set(venues.value.map((venue) => venue.id))
        venues.value = [
          ...venues.value,
          ...venuesData.filter((venue) => !existingIds.has(venue.id))
        ]
      } else {
        venues.value = venuesData
      }
    } catch (err) {
      error.value = err.message ?? 'Failed to load venues.'
    } finally {
      loading.value = false
    }
  }

  async function reload() {
    venues.value = []
    await load()
  }

  function create(payload) {
    const id = Math.max(1000, ...venues.value.map((venue) => Number(venue.id) || 0)) + 1
    const fallbackImage = `https://picsum.photos/seed/admin-venue-${id}/900/500`
    const venue = {
      id,
      name: payload.name?.trim() || 'Untitled Venue',
      description: payload.description?.trim() || 'A premier venue for your event.',
      image: payload.image || fallbackImage,
      images: payload.images?.length ? payload.images : [payload.image || fallbackImage],
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      type: payload.type || 'Conference Center',
      capacity: Number(payload.capacity) || 0,
      amenities: [...(payload.amenities ?? [])]
    }

    venues.value = [venue, ...venues.value]
    return venue
  }

  function update(id, changes) {
    venues.value = venues.value.map(v => v.id === id ? { ...v, ...changes } : v)
    return venues.value.find(v => v.id === id) ?? null
  }

  return { venues, loading, error, load, reload, create, update }
})
