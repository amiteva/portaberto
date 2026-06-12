<template>
  <main>
    <!-- Hero -->
    <section class="venues-hero" aria-label="Venues hero">
      <div class="venues-hero__media">
        <img
          src="https://picsum.photos/seed/venuehero/1920/700"
          alt="Eventus venue spaces"
          class="venues-hero__img"
        />
      </div>
      <div class="venues-hero__content">
        <h5 class="venues-hero__eyebrow">Premium Spaces</h5>
        <h1 class="venues-hero__title">Our Venues</h1>
        <p class="venues-hero__lead">
          From intimate boardrooms to grand ballrooms — find the perfect space for your event.
        </p>
      </div>
    </section>

    <!-- Venues listing -->
    <section class="venues-listing" aria-labelledby="venues-heading">
      <div class="venues-listing__header">
        <div>
          <h2 id="venues-heading" class="venues-listing__title">Available Venues</h2>
          <p class="venues-listing__sub">{{ venuesStore.venues.length }} spaces available</p>
        </div>
        <BaseButton v-if="authStore.isAdmin" size="sm" @click="openCreate">
          Create Venue
        </BaseButton>
      </div>

      <!-- Loading -->
      <div v-if="venuesStore.loading" class="venues-listing__state">
        <LoadingSpinner size="3rem" />
      </div>

      <!-- Error -->
      <div v-else-if="venuesStore.error" class="venues-listing__state venues-listing__state--error" role="alert">
        <p>{{ venuesStore.error }}</p>
        <BaseButton variant="outlined" @click="venuesStore.reload()">Try Again</BaseButton>
      </div>

      <!-- Grid -->
      <ul v-else class="venues-listing__grid">
        <li v-for="venue in venuesStore.venues" :key="venue.id">
          <VenueCard :venue="venue" @edit="openEdit" />
        </li>
      </ul>
    </section>

    <!-- Edit/create Venue Modal (admin only) -->
    <EditVenueModal v-model="showEditModal" :venue="editingVenue" @saved="showEditModal = false" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useVenuesStore } from '@/stores/venues'
import VenueCard from '@/components/VenueCard/VenueCard.vue'
import EditVenueModal from '@/components/EditVenueModal/EditVenueModal.vue'
import LoadingSpinner from '@/components/elements/LoadingSpinner/LoadingSpinner.vue'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const venuesStore = useVenuesStore()
const authStore = useAuthStore()

const editingVenue = ref(null)
const showEditModal = ref(false)

function openEdit(venue) {
  editingVenue.value = venue
  showEditModal.value = true
}

function openCreate() {
  editingVenue.value = null
  showEditModal.value = true
}

onMounted(() => venuesStore.load())
</script>

<style lang="scss" scoped>
@import './VenuesPage.scss';
</style>
