<template>
  <main>
    <section class="favorites-page" aria-labelledby="favorites-heading">
      <div class="favorites-page__header">
        <div>
          <h1 id="favorites-heading" class="favorites-page__title">{{ t('favorites.title') }}</h1>
          <p class="favorites-page__subtitle">
            {{ t('favorites.subtitle', { name: authStore.user?.name ?? t('favorites.fallbackName') }) }}
          </p>
        </div>
        <p class="favorites-page__count">
          {{ t('favorites.count', { count: favoriteEvents.length }) }}
        </p>
      </div>

      <div v-if="eventsStore.loading" class="favorites-page__state" aria-busy="true">
        <LoadingSpinner size="48px" />
        <p>{{ t('favorites.loading') }}</p>
      </div>

      <div v-else-if="eventsStore.error" class="favorites-page__state favorites-page__state--error" role="alert">
        <p>{{ eventsStore.error }}</p>
        <BaseButton variant="outlined" @click="eventsStore.reload()">{{ t('common.tryAgain') }}</BaseButton>
      </div>

      <div v-else-if="favoriteEvents.length === 0" class="favorites-page__empty">
        <div class="favorites-page__empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <p class="favorites-page__empty-title">{{ t('favorites.emptyTitle') }}</p>
        <p class="favorites-page__empty-text">{{ t('favorites.emptyText') }}</p>
        <RouterLink to="/">
          <BaseButton variant="outlined">{{ t('home.browseEvents') }}</BaseButton>
        </RouterLink>
      </div>

      <ul v-else class="favorites-page__grid">
        <li v-for="event in favoriteEvents" :key="event.id">
          <EventCard :event="event" />
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import EventCard from '@/components/EventCard/EventCard.vue'
import LoadingSpinner from '@/components/elements/LoadingSpinner/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useFavoritesStore } from '@/stores/favorites'

const { t } = useI18n()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const favoritesStore = useFavoritesStore()

const favoriteEvents = computed(() => (
  eventsStore.enrichedEvents.filter((event) => favoritesStore.isFavorite(event.id))
))

onMounted(() => {
  eventsStore.load()
})
</script>

<style lang="scss" scoped>
@import './FavoritesPage.scss';
</style>
