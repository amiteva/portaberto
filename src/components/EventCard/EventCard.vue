<template>
  <article
    class="event-card"
    @click="navigate"
  >
    <div class="event-card__media">
      <ImageCarousel :images="event.images || [event.venueImage]" :alt="event.title">
        <span class="event-card__category">{{ event.category }}</span>
        <button
          class="event-card__favorite"
          :class="{ 'event-card__favorite--active': isFav }"
          :aria-label="isFav ? t('eventCard.removeFavorite', { title: event.title }) : t('eventCard.addFavorite', { title: event.title })"
          :aria-pressed="isFav"
          @click.stop="toggleFav"
        >
          <svg viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </ImageCarousel>
    </div>

    <div class="event-card__content">
      <div class="event-card__content-main">
        <h3 class="event-card__title">{{ event.title }}</h3>
        <ul class="event-card__meta">
          <li class="event-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{{ formatDate(event.date) }}</span>
          </li>
          <li class="event-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{{ event.time }}</span>
          </li>
          <li class="event-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ event.location }}</span>
          </li>
        </ul>
      </div>

      <div class="event-card__footer">
        <span class="event-card__price">{{ t('eventCard.fromPrice', { price: event.price }) }}</span>
        <RouterLink
          :to="`/events/${event.id}`"
          class="event-card__link"
          :aria-label="t('eventCard.viewDetails', { title: event.title })"
          @click.stop
        >
          {{ t('eventCard.viewEvent') }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import ImageCarousel from '@/components/elements/ImageCarousel/ImageCarousel.vue'

const props = defineProps({
  event: { type: Object, required: true }
})

const router = useRouter()
const favStore = useFavoritesStore()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const isFav = computed(() => favStore.isFavorite(props.event.id))

function navigate() {
  router.push(`/events/${props.event.id}`)
}

function toggleFav() {
  if (!authStore.isLoggedIn) { router.push('/login'); return }
  favStore.toggle(props.event.id)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(locale.value === 'mk' ? 'mk-MK' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style lang="scss" scoped>
@import './EventCard.scss';
</style>
