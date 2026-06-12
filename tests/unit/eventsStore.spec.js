import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useEventsStore } from '@/stores/events'
import { useBookingsStore } from '@/stores/bookings'
import { fetchEvents, fetchSpeakers } from '@/services/fakerApi'

vi.mock('@/services/fakerApi', () => ({
  fetchEvents: vi.fn(),
  fetchSpeakers: vi.fn()
}))

const events = [
  { id: 1, title: 'Global Innovation Summit' },
  { id: 2, title: 'Design Workshop' }
]

const speakers = [
  { id: 1, name: 'Alex Speaker' },
  { id: 2, name: 'Morgan Speaker' }
]

describe('events store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchEvents).mockReset()
    vi.mocked(fetchSpeakers).mockReset()
  })

  it('loads events and enriches them with speakers', async () => {
    vi.mocked(fetchEvents).mockResolvedValue(events)
    vi.mocked(fetchSpeakers).mockResolvedValue(speakers)

    const store = useEventsStore()
    await store.load()

    expect(fetchEvents).toHaveBeenCalledWith(20)
    expect(fetchSpeakers).toHaveBeenCalledWith(20)
    expect(store.enrichedEvents).toEqual([
      { ...events[0], speakers: [speakers[0]], speaker: speakers[0] },
      { ...events[1], speakers: [speakers[1]], speaker: speakers[1] }
    ])
    expect(store.getById(2)).toEqual({ ...events[1], speakers: [speakers[1]], speaker: speakers[1] })
  })

  it('does not assign fallback speakers when an event explicitly has no speakers', async () => {
    vi.mocked(fetchEvents).mockResolvedValue([{ id: 1, title: 'Speakerless Event', speakers: [] }])
    vi.mocked(fetchSpeakers).mockResolvedValue(speakers)

    const store = useEventsStore()
    await store.load()

    expect(store.getById(1)).toMatchObject({
      title: 'Speakerless Event',
      speakers: [],
      speaker: null
    })
  })

  it('does not reload when events are already present', async () => {
    vi.mocked(fetchEvents).mockResolvedValue(events)
    vi.mocked(fetchSpeakers).mockResolvedValue(speakers)

    const store = useEventsStore()
    await store.load()
    await store.load()

    expect(fetchEvents).toHaveBeenCalledTimes(1)
    expect(fetchSpeakers).toHaveBeenCalledTimes(1)
  })

  it('stores load errors and clears them on reload', async () => {
    vi.mocked(fetchEvents).mockRejectedValueOnce(new Error('Network failed'))
    vi.mocked(fetchSpeakers).mockResolvedValueOnce(speakers)

    const store = useEventsStore()
    await store.load()

    expect(store.error).toBe('Network failed')
    expect(store.loading).toBe(false)
    expect(store.enrichedEvents).toEqual([])

    vi.mocked(fetchEvents).mockResolvedValueOnce(events)
    vi.mocked(fetchSpeakers).mockResolvedValueOnce(speakers)

    await store.reload()

    expect(store.error).toBeNull()
    expect(store.enrichedEvents).toHaveLength(2)
  })

  it('creates and updates events locally', () => {
    const store = useEventsStore()
    const bookingsStore = useBookingsStore()

    const created = store.create({
      title: 'Admin Created Event',
      description: 'Created from admin tools',
      date: '2026-10-10',
      time: '18:00',
      price: 250,
      capacity: 120,
      location: 'Skopje, North Macedonia',
      category: 'Summit',
      speakers: [
        {
          id: 1,
          name: 'Dana Speaker',
          jobTitle: 'Research Lead',
          email: 'dana@example.com',
          photo: '/incognito-speaker.svg'
        }
      ]
    })

    expect(created.id).toBe(1001)
    expect(store.getById(created.id)).toMatchObject({
      title: 'Admin Created Event',
      location: 'Skopje, North Macedonia',
      category: 'Summit',
      speakers: [
        expect.objectContaining({
          name: 'Dana Speaker',
          jobTitle: 'Research Lead'
        })
      ]
    })

    const updated = store.update(created.id, {
      title: 'Updated Admin Event',
      price: 300
    })

    expect(updated).toMatchObject({
      title: 'Updated Admin Event',
      price: 300
    })

    bookingsStore.add({
      event: updated,
      seats: 2,
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com'
    })

    const cancelled = store.cancel(created.id)
    expect(cancelled.status).toBe('cancelled')
    expect(bookingsStore.bookings[0].status).toBe('cancelled')
  })

  it('keeps cancelled event status after reloading API events', async () => {
    vi.mocked(fetchEvents).mockResolvedValue(events)
    vi.mocked(fetchSpeakers).mockResolvedValue(speakers)

    const store = useEventsStore()
    await store.load()

    store.cancel(1)

    expect(JSON.parse(localStorage.getItem('portaberto-events')).find((event) => event.id === 1).status).toBe('cancelled')

    await store.reload()

    expect(fetchEvents).toHaveBeenCalledTimes(2)
    expect(store.getById(1).status).toBe('cancelled')
  })

  it('overwrites older persisted event state when cancelling', async () => {
    localStorage.setItem('portaberto-events', JSON.stringify([
      { id: 1, title: 'Old Event State', status: 'active' }
    ]))
    vi.mocked(fetchEvents).mockResolvedValue(events)
    vi.mocked(fetchSpeakers).mockResolvedValue(speakers)

    const store = useEventsStore()
    await store.load()

    store.cancel(1)

    expect(JSON.parse(localStorage.getItem('portaberto-events')).find((event) => event.id === 1).status).toBe('cancelled')
  })

  it('cancels events hosted at a deleted venue', () => {
    const store = useEventsStore()

    const linkedById = store.create({
      title: 'Venue ID Event',
      date: '2026-10-10',
      location: 'Grand Hall',
      venueId: 5,
      venueName: 'The Grand Hall'
    })
    const linkedByLocation = store.create({
      title: 'Venue Location Event',
      date: '2026-10-11',
      location: 'The Grand Hall'
    })
    const unrelated = store.create({
      title: 'Other Event',
      date: '2026-10-12',
      location: 'Other Venue'
    })

    const cancelled = store.cancelByVenue({ id: 5, name: 'The Grand Hall' })

    expect(cancelled).toHaveLength(2)
    expect(store.getById(linkedById.id).status).toBe('cancelled')
    expect(store.getById(linkedByLocation.id).status).toBe('cancelled')
    expect(store.getById(unrelated.id).status).toBe('active')
  })
})
