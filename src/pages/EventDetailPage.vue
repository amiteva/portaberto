<template>
  <main>
    <!-- Back -->
    <div class="detail-back">
      <button class="detail-back__btn" @click="router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        All Events
      </button>
    </div>

    <!-- Loading -->
    <div v-if="eventsStore.loading" class="detail-state">
      <LoadingSpinner size="48px" />
    </div>

    <!-- Error -->
    <div v-else-if="eventsStore.error" class="detail-state detail-state--error" role="alert">
      <p>{{ eventsStore.error }}</p>
      <BaseButton variant="outlined" @click="eventsStore.reload()">Retry</BaseButton>
    </div>

    <!-- Not found -->
    <div v-else-if="!event" class="detail-state detail-state--error" role="alert">
      <p>Event not found.</p>
      <BaseButton :to="'/'">Back to Events</BaseButton>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Hero band -->
      <section class="detail-hero" :aria-label="event.title">
        <div class="detail-hero__meta">
          <div class="detail-hero__tags">
            <span class="detail-hero__category">{{ event.category }}</span>
            <span v-if="event.status === 'cancelled'" class="detail-hero__status">Canceled</span>
          </div>

          <h1 class="detail-hero__title">{{ event.title }}</h1>
          <ul class="detail-hero__info">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{{ formatDate(event.date) }}</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ event.time }}</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ event.location }}</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>{{ event.capacity }} capacity</span>
            </li>
          </ul>
        </div>
      </section>

      <section v-if="authStore.isAdmin" class="detail-admin-panel" aria-label="Admin event controls">
        <div>
          <p class="detail-admin-panel__label">Admin controls</p>
          <p class="detail-admin-panel__text">Manage this event.</p>
        </div>

        <div class="detail-admin-panel__actions">
          <button class="detail-admin-panel__btn" @click="showEditEventModal = true">
            Edit Event
          </button>
          <p v-if="event.status === 'cancelled'" class="detail-admin-panel__status">
            Event cancelled
          </p>
          <template v-else-if="confirmingCancelEvent">
            <span class="detail-admin-panel__confirm">Cancel this event?</span>
            <button class="detail-admin-panel__btn" @click="confirmingCancelEvent = false">
              Keep Event
            </button>
            <button class="detail-admin-panel__btn detail-admin-panel__btn--danger" @click="cancelEvent">
              Confirm Cancel
            </button>
          </template>
          <button v-else class="detail-admin-panel__btn detail-admin-panel__btn--danger" @click="confirmingCancelEvent = true">
            Cancel Event
          </button>
        </div>
      </section>

      <section v-if="!authStore.isAdmin" class="detail-registration" aria-label="Event registration">
        <div>
          <p class="detail-registration__label">Starting from</p>
          <p class="detail-registration__price">€{{ event.price }}</p>
          <p class="detail-registration__note">
            {{ event.status === 'cancelled' ? 'Registration is closed.' : `${event.capacity} spots available` }}
          </p>
        </div>

        <div class="detail-registration__actions">
          <button
            class="detail-registration__fav"
            :class="{ 'detail-registration__fav--active': isFav }"
            :aria-pressed="isFav"
            :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'"
            @click="toggleFav"
          >
            <svg viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {{ isFav ? 'Saved' : 'Save' }}
          </button>
          <BaseButton size="lg" :disabled="event.status === 'cancelled'" @click="registerOrLogin">
            {{ event.status === 'cancelled' ? 'Event Cancelled' : 'Register Now' }}
          </BaseButton>
        </div>
      </section>

      <!-- Body layout -->
      <div class="detail-body">
        <section class="detail-description" aria-labelledby="desc-heading">
          <h2 id="desc-heading" class="detail-description__title">About this Event</h2>
          <p class="detail-description__text">{{ event.description }}</p>
        </section>

        <section v-if="featuredSpeakers.length" class="detail-speakers" aria-labelledby="speakers-heading">
          <h2 id="speakers-heading" class="detail-speakers__title">Featured Speakers</h2>
          <div class="detail-speakers__grid">
            <SpeakerCard v-for="speaker in featuredSpeakers" :key="speaker.id ?? speaker.email ?? speaker.name" :speaker="speaker" />
          </div>
        </section>

        <section class="detail-venue" aria-labelledby="venue-heading">
          <h2 id="venue-heading" class="detail-venue__title">The Venue</h2>
          <div class="detail-venue__image-wrap">
            <ImageCarousel :images="event.images || [event.venueImage]" :alt="`${event.location} venue`" />
            <div class="detail-venue__overlay">
              <p class="detail-venue__location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ event.location }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </template>

    <!-- Register modal -->
    <RegisterModal v-model="showModal" :event="event" />
    <EventAdminModal v-model="showEditEventModal" :event="event" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import LoadingSpinner from '@/components/elements/LoadingSpinner/LoadingSpinner.vue'
import SpeakerCard from '@/components/SpeakerCard/SpeakerCard.vue'
import RegisterModal from '@/components/RegisterModal/RegisterModal.vue'
import EventAdminModal from '@/components/EventAdminModal/EventAdminModal.vue'
import ImageCarousel from '@/components/elements/ImageCarousel/ImageCarousel.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const favStore = useFavoritesStore()
const authStore = useAuthStore()

const showModal = ref(false)
const showEditEventModal = ref(false)
const confirmingCancelEvent = ref(false)

const event = computed(() => eventsStore.getById(route.params.id))
const isFav = computed(() => event.value ? favStore.isFavorite(event.value.id) : false)
const featuredSpeakers = computed(() => event.value?.speakers ?? (event.value?.speaker ? [event.value.speaker] : []))

function toggleFav() {
  if (authStore.isAdmin) return
  if (!authStore.isLoggedIn) { router.push('/login'); return }
  favStore.toggle(event.value.id)
}

function registerOrLogin() {
  if (!authStore.isLoggedIn) { router.push('/login'); return }
  if (authStore.isAdmin) return
  if (event.value?.status === 'cancelled') return
  showModal.value = true
}

function cancelEvent() {
  if (!event.value) return
  eventsStore.cancel(event.value.id)
  confirmingCancelEvent.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(() => eventsStore.load())
</script>

<style lang="scss" scoped>
@import './EventDetailPage.scss';
</style>
