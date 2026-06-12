<template>
  <article class="venue-card">
    <div class="venue-card__media">
      <ImageCarousel :images="venue.images || [venue.image]" :alt="venue.name">
        <span class="venue-card__type">{{ venue.type }}</span>
      </ImageCarousel>
    </div>

    <div class="venue-card__body">
      <div class="venue-card__info">
        <h3 class="venue-card__name">{{ venue.name }}</h3>
        <p class="venue-card__description">{{ venue.description }}</p>

        <ul class="venue-card__meta">
          <li class="venue-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Up to <strong>{{ venue.capacity }}</strong> guests</span>
          </li>
        </ul>

        <ul class="venue-card__amenities" aria-label="Amenities">
          <li v-for="amenity in venue.amenities" :key="amenity" class="venue-card__amenity">
            {{ amenity }}
          </li>
        </ul>
      </div>

      <div v-if="authStore.isAdmin" class="venue-card__admin-actions">
        <BaseButton variant="outlined" size="sm" @click="$emit('edit', venue)">Edit Venue</BaseButton>
      </div>

      <RouterLink v-if="!authStore.isAdmin" :to="`/contact?venue=${venue.id}`" class="venue-card__cta-wrap">
        <BaseButton variant="outlined" :full-width="true">
          Book this Venue
        </BaseButton>
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import ImageCarousel from '@/components/elements/ImageCarousel/ImageCarousel.vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  venue: { type: Object, required: true }
})

defineEmits(['edit'])

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
@import './VenueCard.scss';
</style>
