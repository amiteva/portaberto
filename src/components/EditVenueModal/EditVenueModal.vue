<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="edit-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-venue-title"
        @click.self="$emit('update:modelValue', false)"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <Transition name="slide-up">
          <div v-if="modelValue" class="edit-modal">
            <button
              class="edit-modal__close"
              aria-label="Close edit form"
              @click="$emit('update:modelValue', false)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <header class="edit-modal__header">
              <span class="edit-modal__eyebrow">Admin</span>
              <h2 id="edit-venue-title" class="edit-modal__title">{{ isEditing ? 'Edit Venue' : 'Create Venue' }}</h2>
            </header>

            <form class="edit-modal__body" novalidate @submit.prevent="submit">
              <BaseInput
                v-model="form.name"
                label="Venue name"
                required
              />

              <BaseTextarea
                v-model="form.description"
                label="Description"
              />

              <BaseInput
                v-model.number="form.capacity"
                label="Capacity"
                type="number"
              />

              <div class="edit-modal__field-group">
                <label class="edit-modal__label" for="venue-type-select">Type</label>
                <select id="venue-type-select" v-model="form.type" class="edit-modal__select">
                  <option v-for="t in venueTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div class="edit-modal__field-group">
                <p class="edit-modal__chips-label">Amenities (click to toggle)</p>
                <div class="edit-modal__chips">
                  <button
                    v-for="amenity in allAmenities"
                    :key="amenity"
                    type="button"
                    class="edit-modal__chip"
                    :class="{ 'edit-modal__chip--active': form.amenities.includes(amenity) }"
                    @click="toggleAmenity(amenity)"
                  >
                    {{ amenity }}
                  </button>
                </div>
              </div>
            </form>

            <div class="edit-modal__actions">
              <BaseButton variant="outlined" type="button" @click="$emit('update:modelValue', false)">
                Cancel
              </BaseButton>
              <BaseButton type="button" @click="submit">
                {{ isEditing ? 'Save Changes' : 'Create Venue' }}
              </BaseButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useVenuesStore } from '@/stores/venues'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import BaseInput from '@/components/elements/BaseInput/BaseInput.vue'
import BaseTextarea from '@/components/elements/BaseTextarea/BaseTextarea.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  venue: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const venuesStore = useVenuesStore()
const isEditing = computed(() => !!props.venue)

const venueTypes = ['Grand Ballroom', 'Conference Center', 'Garden Terrace', 'Rooftop Lounge', 'Exhibition Hall', 'Theatre Auditorium']

const allAmenities = [
  'AV Equipment', 'Wi-Fi', 'Catering', 'Stage & Lighting', 'Green Room', 'Parking',
  'Outdoor Terrace', 'Bar Service', 'Accessibility', 'Breakout Rooms', 'Video Conferencing', 'Reception Area'
]

const form = reactive({
  name: '',
  description: '',
  capacity: 0,
  type: '',
  amenities: []
})

function initForm() {
  form.name = props.venue?.name ?? ''
  form.description = props.venue?.description ?? ''
  form.capacity = props.venue?.capacity ?? 0
  form.type = props.venue?.type ?? venueTypes[0]
  form.amenities = [...(props.venue?.amenities ?? [])]
}

watch(() => props.modelValue, (open) => {
  if (open) initForm()
})

watch(() => props.venue, () => {
  if (props.modelValue) initForm()
})

function toggleAmenity(amenity) {
  const idx = form.amenities.indexOf(amenity)
  if (idx === -1) {
    form.amenities.push(amenity)
  } else {
    form.amenities.splice(idx, 1)
  }
}

function submit() {
  const payload = {
    name: form.name,
    description: form.description,
    capacity: form.capacity,
    type: form.type,
    amenities: [...form.amenities]
  }
  const saved = props.venue
    ? venuesStore.update(props.venue.id, payload)
    : venuesStore.create(payload)
  emit('saved', saved)
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
@import './EditVenueModal.scss';
</style>
