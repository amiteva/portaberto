<template>
  <section class="event-grid" :aria-label="t('eventsGrid.aria')">
    <!-- Loading -->
    <div v-if="loading" class="event-grid__state">
      <div class="event-grid__skeleton-grid" aria-busy="true" :aria-label="t('eventsGrid.loading')">
        <div v-for="n in 8" :key="n" class="event-grid__skeleton">
          <div class="event-grid__skeleton-img" />
          <div class="event-grid__skeleton-body">
            <div class="event-grid__skeleton-line event-grid__skeleton-line--title" />
            <div class="event-grid__skeleton-line" />
            <div class="event-grid__skeleton-line event-grid__skeleton-line--short" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="event-grid__state event-grid__state--error" role="alert">
      <p>{{ error }}</p>
      <BaseButton variant="outlined" @click="$emit('retry')">{{ t('common.tryAgain') }}</BaseButton>
    </div>

    <!-- Empty -->
    <div v-else-if="events.length === 0" class="event-grid__state event-grid__state--empty">
      <p>{{ t('eventsGrid.empty') }}</p>
      <BaseButton variant="outlined" @click="$emit('clear-filters')">{{ t('common.clearFilters') }}</BaseButton>
    </div>

    <!-- Grid -->
    <template v-else>
      <p class="event-grid__count">
        {{ t('eventsGrid.showing') }} <strong>{{ events.length }}</strong> {{ t(events.length === 1 ? 'eventsGrid.event' : 'eventsGrid.events') }}
      </p>
      <ul class="event-grid__items">
        <li v-for="event in paginatedEvents" :key="event.id">
          <EventCard :event="event" />
        </li>
      </ul>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="event-grid__pagination" :aria-label="t('eventsGrid.pagination')">
        <button
          class="event-grid__page-btn"
          :disabled="page === 1"
          :aria-label="t('eventsGrid.previousPage')"
          @click="page--"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          :class="['event-grid__page-num', { 'event-grid__page-num--active': p === page }]"
          :aria-label="t('eventsGrid.page', { page: p })"
          :aria-current="p === page ? 'page' : undefined"
          @click="page = p"
        >
          {{ p }}
        </button>
        <button
          class="event-grid__page-btn"
          :disabled="page === totalPages"
          :aria-label="t('eventsGrid.nextPage')"
          @click="page++"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </nav>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EventCard from '@/components/events/EventCard/EventCard.vue'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'

const props = defineProps({
  events:  { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error:   { type: String, default: '' }
})

defineEmits(['retry', 'clear-filters'])
const { t } = useI18n()

const PAGE_SIZE = 8
const page = ref(1)

const totalPages = computed(() => Math.ceil(props.events.length / PAGE_SIZE))
const paginatedEvents = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return props.events.slice(start, start + PAGE_SIZE)
})

// Reset to page 1 when the filtered list changes
watch(() => props.events, () => { page.value = 1 })
</script>

<style lang="scss" scoped>
@import './EventGrid.scss';
</style>
