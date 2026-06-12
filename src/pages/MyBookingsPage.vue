<template>
  <main>
    <div class="bookings-page">
      <!-- Header -->
      <div class="bookings-page__header">
        <h1 class="bookings-page__title">My Bookings</h1>
        <p class="bookings-page__subtitle">Welcome back, {{ authStore.user?.name }}</p>
      </div>

      <!-- Filter tabs -->
      <div class="bookings-page__tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="bookings-page__tab"
          :class="{ 'bookings-page__tab--active': activeTab === tab.value }"
          role="tab"
          :aria-selected="activeTab === tab.value"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="filteredBookings.length === 0" class="bookings-page__empty">
        <div class="bookings-page__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/>
          </svg>
        </div>
        <p class="bookings-page__empty-title">No bookings found</p>
        <p class="bookings-page__empty-text">
          {{ activeTab === 'all' ? "You haven't booked any events yet." : `No ${activeTab} bookings.` }}
        </p>
        <RouterLink to="/">
          <BaseButton variant="outlined">Browse Events</BaseButton>
        </RouterLink>
      </div>

      <!-- Booking cards -->
      <div v-else class="bookings-page__grid">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="booking-card"
          :class="{ 'booking-card--cancelled': booking.status === 'cancelled' }"
        >
          <div class="booking-card__top">
            <span class="booking-card__category">{{ booking.eventCategory }}</span>
            <span class="booking-card__status" :class="`booking-card__status--${booking.status}`">
              {{ booking.status }}
            </span>
          </div>

          <h3 class="booking-card__title">{{ booking.eventTitle }}</h3>

          <ul class="booking-card__meta">
            <li class="booking-card__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{{ formatDate(booking.eventDate) }}</span>
            </li>
            <li class="booking-card__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ booking.eventTime }}</span>
            </li>
            <li class="booking-card__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ booking.eventLocation }}</span>
            </li>
          </ul>

          <p class="booking-card__seats">Seats: {{ booking.seats }}</p>

          <!-- Actions (confirmed only) -->
          <div v-if="booking.status === 'confirmed'" class="booking-card__actions">
            <!-- Edit seats -->
            <template v-if="editingId === booking.id">
              <!-- Inline edit panel -->
            </template>
            <button class="booking-card__btn" @click="toggleEdit(booking)">
              {{ editingId === booking.id ? 'Close' : 'Edit seats' }}
            </button>

            <!-- Cancel -->
            <template v-if="cancelingId === booking.id">
              <span class="booking-card__confirm-text">Confirm cancellation?</span>
              <button class="booking-card__btn" @click="cancelingId = null">Cancel</button>
              <button class="booking-card__btn booking-card__btn--danger" @click="confirmCancel(booking.id)">Yes</button>
            </template>
            <button v-else class="booking-card__btn booking-card__btn--danger" @click="cancelingId = booking.id">
              Cancel booking
            </button>
          </div>

          <!-- Inline edit panel -->
          <div v-if="editingId === booking.id" class="booking-card__edit-panel">
            <span class="booking-card__edit-label">Number of seats:</span>
            <div class="booking-card__stepper">
              <button class="booking-card__stepper-btn" @click="editSeats = Math.max(1, editSeats - 1)">−</button>
              <input
                v-model.number="editSeats"
                type="number"
                min="1"
                max="10"
                class="booking-card__stepper-val"
                aria-label="Seats"
              />
              <button class="booking-card__stepper-btn" @click="editSeats = Math.min(10, editSeats + 1)">+</button>
            </div>
            <button class="booking-card__btn booking-card__btn--primary" @click="saveEdit(booking.id)">Save</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

const activeTab = ref('all')
const editingId = ref(null)
const editSeats = ref(1)
const cancelingId = ref(null)

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookingsStore.bookings
  return bookingsStore.bookings.filter(b => b.status === activeTab.value)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function toggleEdit(booking) {
  if (editingId.value === booking.id) {
    editingId.value = null
  } else {
    editingId.value = booking.id
    editSeats.value = booking.seats
    cancelingId.value = null
  }
}

function saveEdit(id) {
  bookingsStore.edit(id, { seats: editSeats.value })
  editingId.value = null
}

function confirmCancel(id) {
  bookingsStore.cancel(id)
  cancelingId.value = null
}
</script>

<style lang="scss" scoped>
@import './MyBookingsPage.scss';
</style>
