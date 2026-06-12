import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useEventsStore } from '@/stores/events'
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
      { ...events[0], speaker: speakers[0] },
      { ...events[1], speaker: speakers[1] }
    ])
    expect(store.getById(2)).toEqual({ ...events[1], speaker: speakers[1] })
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

    const created = store.create({
      title: 'Admin Created Event',
      description: 'Created from admin tools',
      date: '2026-10-10',
      time: '18:00',
      price: 250,
      capacity: 120,
      location: 'Skopje, North Macedonia',
      category: 'Summit'
    })

    expect(created.id).toBe(1001)
    expect(store.getById(created.id)).toMatchObject({
      title: 'Admin Created Event',
      location: 'Skopje, North Macedonia',
      category: 'Summit'
    })

    const updated = store.update(created.id, {
      title: 'Updated Admin Event',
      price: 300
    })

    expect(updated).toMatchObject({
      title: 'Updated Admin Event',
      price: 300
    })
  })
})
