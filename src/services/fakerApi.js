const BASE = 'https://fakerapi.it/api/v2'

// ─── Curated names ────────────────────────────────────────────────────────────

const EVENT_NAMES = [
  'Global Innovation Summit',
  'Future of Technology Conference',
  'Leadership Excellence Forum',
  'Digital Transformation Expo',
  'Sustainable Business Congress',
  'Creative Industries Gala',
  'Healthcare Innovation Summit',
  'FinTech Future Forum',
  'Design & Strategy Workshop',
  'AI & Machine Learning Symposium',
  'Marketing Masterclass',
  'Startup Pitch Night',
  'Blockchain & Web3 Conference',
  'Corporate Governance Summit',
  'Women in Leadership Gala',
  'Product Innovation Workshop',
  'Smart Cities Congress',
  'Cybersecurity Excellence Forum',
  'Green Energy Symposium',
  'Cultural Arts Exhibition',
]

const VENUE_NAMES = [
  'The Grand Pavilion',
  'Skyline Conference Center',
  'Heritage Ballroom',
  'The Meridian Hall',
  'Lakeside Convention Center',
  'The Azure Terrace',
  'Metropolitan Events Hub',
  'The Prestige Suite',
  'Harbor View Venue',
  'The Crystal Gallery',
  'Pinnacle Conference Hall',
  'The Sapphire Lounge',
]

const CATEGORIES     = ['Conference', 'Workshop', 'Gala', 'Exhibition', 'Summit', 'Symposium']
const SPEAKER_TITLES = ['CEO', 'CTO', 'Director', 'VP Engineering', 'Head of Innovation', 'Principal Researcher', 'Lead Architect', 'Chief Strategy Officer']
const EVENT_TIMES    = ['09:00', '10:30', '11:00', '14:00', '15:30', '18:00', '19:30', '20:00']
const VENUE_TYPES    = ['Grand Ballroom', 'Conference Center', 'Garden Terrace', 'Rooftop Lounge', 'Exhibition Hall', 'Theatre Auditorium']
const CAPACITIES     = [150, 300, 80, 200, 500, 120, 250, 400, 60, 180, 350, 100]
const AMENITIES      = [
  ['AV Equipment', 'Wi-Fi', 'Catering'],
  ['Stage & Lighting', 'Green Room', 'Parking'],
  ['Outdoor Terrace', 'Bar Service', 'Accessibility'],
  ['Breakout Rooms', 'Video Conferencing', 'Reception Area'],
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function get(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FakerAPI ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (!Array.isArray(json.data)) throw new Error('Unexpected API response shape')
  return json.data
}

function getFutureDate(daysOffset) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().slice(0, 10)
}

function normalizePrice(raw) {
  const n = typeof raw === 'number' ? raw : parseFloat(raw) || Math.random()
  return Math.round((Math.abs(n) * 1000) % 900) + 50
}

function normalizeCapacity(raw) {
  const n = typeof raw === 'number' ? raw : parseFloat(raw) || Math.random()
  return Math.round((Math.abs(n) * 1000) % 450) + 50
}

// ─── Events (custom endpoint) ─────────────────────────────────────────────────

export async function fetchEvents(quantity = 20) {
  const raw = await get('custom', {
    _quantity: quantity,
    _seed: 42,
    description: 'paragraph',
    price: 'number',
    seats: 'number',
    city: 'city',
    country: 'country'
  })

  return raw.map((item, i) => ({
    id: i + 1,
    title: EVENT_NAMES[i % EVENT_NAMES.length],
    description: item?.description ?? 'No description available.',
    // Spread events from 2 weeks to ~11 months in the future
    date: getFutureDate(14 + (i * 23) % 330),
    time: EVENT_TIMES[i % EVENT_TIMES.length],
    price: normalizePrice(item?.price),
    capacity: normalizeCapacity(item?.seats),
    location: [item?.city, item?.country].filter(Boolean).join(', ') || 'TBD',
    category: CATEGORIES[i % CATEGORIES.length],
    images: [
      `https://picsum.photos/seed/ev${i + 200}/1200/600`,
      `https://picsum.photos/seed/ev${i + 100}/1200/600`,
      `https://picsum.photos/seed/ev${i + 400}/1200/600`
    ],
    venueImage: `https://picsum.photos/seed/ev${i + 200}/1200/600`
  }))
}

// ─── Speakers (persons endpoint) ─────────────────────────────────────────────

export async function fetchSpeakers(quantity = 20) {
  const raw = await get('persons', { _quantity: quantity, _seed: 42 })

  return raw.map((p, i) => ({
    id: i + 1,
    name: `${p?.firstname ?? ''} ${p?.lastname ?? ''}`.trim() || `Speaker ${i + 1}`,
    jobTitle: SPEAKER_TITLES[i % SPEAKER_TITLES.length],
    email: p?.email ?? '',
    photo: `https://picsum.photos/seed/spk${p?.firstname ?? i}/300/300`
  }))
}

// ─── Venues (places endpoint) ─────────────────────────────────────────────────

export async function fetchPlaces(quantity = 12) {
  const raw = await get('places', { _quantity: quantity, _seed: 77 })

  return raw.map((item, i) => {
    const imageUrl =
      (typeof item?.image === 'object' ? item.image?.url : item?.image) ??
      `https://picsum.photos/seed/vn${i + 50}/900/500`

    return {
      id: i + 1,
      name: VENUE_NAMES[i % VENUE_NAMES.length],
      description: (item?.description ?? 'A premier venue for your event.').slice(0, 200),
      image: imageUrl,
      images: [
        imageUrl,
        `https://picsum.photos/seed/vn${i + 100}/900/500`,
        `https://picsum.photos/seed/vn${i + 200}/900/500`
      ],
      latitude: item?.latitude,
      longitude: item?.longitude,
      type: VENUE_TYPES[i % VENUE_TYPES.length],
      capacity: CAPACITIES[i % CAPACITIES.length],
      amenities: AMENITIES[i % AMENITIES.length]
    }
  })
}
