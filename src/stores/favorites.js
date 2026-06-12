import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY = 'eventus-favorites'

function normalizeId(id) {
  const normalized = Number(id)
  return Number.isFinite(normalized) ? normalized : null
}

function loadBuckets() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (!stored || Array.isArray(stored) || typeof stored !== 'object') return {}

    return Object.entries(stored).reduce((acc, [userKey, ids]) => {
      if (!Array.isArray(ids)) return acc
      acc[userKey] = [...new Set(ids.map(normalizeId).filter((id) => id !== null))]
      return acc
    }, {})
  } catch {
    return {}
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const authStore = useAuthStore()
  const buckets = ref(loadBuckets())
  const activeUserKey = computed(() => {
    if (!authStore.user) return null
    return `${authStore.user.role}:${authStore.user.id}`
  })

  const ids = computed(() => {
    if (!activeUserKey.value) return new Set()
    return new Set(buckets.value[activeUserKey.value] ?? [])
  })

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buckets.value))
  }

  function toggle(id) {
    if (!activeUserKey.value) return false

    const normalized = normalizeId(id)
    if (normalized === null) return false

    const nextIds = new Set(ids.value)
    if (nextIds.has(normalized)) {
      nextIds.delete(normalized)
    } else {
      nextIds.add(normalized)
    }

    buckets.value = {
      ...buckets.value,
      [activeUserKey.value]: [...nextIds]
    }
    persist()
    return nextIds.has(normalized)
  }

  function isFavorite(id) {
    const normalized = normalizeId(id)
    return normalized !== null && ids.value.has(normalized)
  }

  return { ids, toggle, isFavorite }
})
