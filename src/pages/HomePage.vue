<template>
  <main>
    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="home-hero" :aria-label="t('home.heroAria')">
      <div class="home-hero__media">
        <img
          src="https://picsum.photos/seed/portabertohero/1920/800"
          :alt="t('home.heroImageAlt')"
          class="home-hero__img"
          fetchpriority="high"
          decoding="async"
        />
      </div>
      <div class="home-hero__content">
        <h5 class="home-hero__eyebrow">{{ t('home.eyebrow') }}</h5>
        <h1 class="home-hero__title">{{ t('home.titleLine1') }}<br />{{ t('home.titleLine2') }}</h1>
        <p class="home-hero__lead">
          {{ t('home.lead') }}
        </p>
        <div class="home-hero__actions">
          <BaseButton size="lg" @click="scrollToEvents">{{ t('home.browseEvents') }}</BaseButton>
          <BaseButton v-if="!authStore.isAdmin" variant="outlined" size="lg" :to="'/venue-request'">{{ t('home.bookVenue') }}</BaseButton>
        </div>
      </div>
    </section>

    <!-- ── Events section ────────────────────────────────────────────────── -->
    <section id="events-section" class="home-events" aria-labelledby="events-heading">
      <div class="home-events__header">
        <div>
          <h2 id="events-heading" class="home-events__title">{{ t('home.upcomingEvents') }}</h2>
          <p class="home-events__subtitle">
            {{ eventsSummary }}
          </p>
        </div>
        <BaseButton v-if="authStore.isAdmin" size="sm" @click="showCreateEventModal = true">
          Create Event
        </BaseButton>
      </div>

      <EventFilters
        v-model:search="search"
        v-model:category="category"
        v-model:sort="sort"
      />

      <EventGrid
        :events="filteredEvents"
        :loading="eventsStore.loading"
        :error="eventsStore.error"
        @retry="eventsStore.reload()"
        @clear-filters="clearFilters"
      />
    </section>

    <!-- ── Google Reviews ───────────────────────────────────────────────── -->
    <GoogleReviews />

    <EventAdminModal v-model="showCreateEventModal" />
  </main>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '@/stores/events'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import EventFilters from '@/components/EventFilters/EventFilters.vue'
import EventGrid from '@/components/EventGrid/EventGrid.vue'
import EventAdminModal from '@/components/EventAdminModal/EventAdminModal.vue'
const GoogleReviews = defineAsyncComponent(() => import('@/components/GoogleReviews/GoogleReviews.vue'))

const eventsStore = useEventsStore()
const favStore = useFavoritesStore()
const authStore = useAuthStore()
const { t } = useI18n()

const search   = ref('')
const category = ref('All')
const sort     = ref('date-asc')
const showCreateEventModal = ref(false)

const favCount = computed(() => favStore.ids.size)
const eventsSummary = computed(() => {
  const saved = favCount.value > 0 ? t('home.savedCount', { count: favCount.value }) : ''
  return `${saved}${t('home.eventsTotal', { count: eventsStore.enrichedEvents.length })}`
})

const filteredEvents = computed(() => {
  let list = [...eventsStore.enrichedEvents]

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    )
  }

  if (category.value !== 'All') {
    list = list.filter((e) => e.category === category.value)
  }

  switch (sort.value) {
    case 'date-asc':   list.sort((a, b) => new Date(a.date) - new Date(b.date)); break
    case 'date-desc':  list.sort((a, b) => new Date(b.date) - new Date(a.date)); break
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break
    case 'price-desc': list.sort((a, b) => b.price - a.price); break
    case 'name-asc':   list.sort((a, b) => a.title.localeCompare(b.title)); break
  }

  return list
})

function clearFilters() {
  search.value = ''
  category.value = 'All'
  sort.value = 'date-asc'
}

function scrollToEvents() {
  document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => eventsStore.load())
</script>

<style lang="scss" scoped>
@import './HomePage.scss';
</style>
