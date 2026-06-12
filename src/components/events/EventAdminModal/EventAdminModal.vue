<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="event-admin-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-admin-title"
        @click.self="$emit('update:modelValue', false)"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <Transition name="slide-up">
          <div v-if="modelValue" class="event-admin-modal">
            <button
              class="event-admin-modal__close"
              aria-label="Close event form"
              @click="$emit('update:modelValue', false)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <header class="event-admin-modal__header">
              <span class="event-admin-modal__eyebrow">Admin</span>
              <h2 id="event-admin-title" class="event-admin-modal__title">
                {{ isEditing ? 'Edit Event' : 'Create Event' }}
              </h2>
            </header>

            <form class="event-admin-modal__body" novalidate @submit.prevent="submit">
              <BaseInput v-model="form.title" label="Event title" required :error="errors.title" />
              <BaseTextarea v-model="form.description" label="Description" :rows="4" />

              <div class="event-admin-modal__grid">
                <BaseInput v-model="form.date" label="Date" type="date" required :error="errors.date" />
                <BaseInput v-model="form.time" label="Time" type="time" />
                <BaseInput v-model.number="form.price" label="Price" type="number" />
                <BaseInput v-model.number="form.capacity" label="Capacity" type="number" />
              </div>

              <BaseInput v-model="form.location" label="Location" required :error="errors.location" />

              <div class="event-admin-modal__field-group">
                <label class="event-admin-modal__label" for="event-category-select">Category</label>
                <select id="event-category-select" v-model="form.category" class="event-admin-modal__select">
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>
            </form>

            <div class="event-admin-modal__actions">
              <BaseButton variant="outlined" type="button" @click="$emit('update:modelValue', false)">
                Cancel
              </BaseButton>
              <BaseButton type="button" @click="submit">
                {{ isEditing ? 'Save Changes' : 'Create Event' }}
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
import { useEventsStore } from '@/stores/events'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import BaseInput from '@/components/elements/BaseInput/BaseInput.vue'
import BaseTextarea from '@/components/elements/BaseTextarea/BaseTextarea.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  event: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])
const eventsStore = useEventsStore()
const categories = ['Conference', 'Workshop', 'Gala', 'Exhibition', 'Summit', 'Symposium']

const isEditing = computed(() => !!props.event)

const form = reactive({
  title: '',
  description: '',
  date: '',
  time: '09:00',
  price: 0,
  capacity: 0,
  location: '',
  category: 'Conference'
})

const errors = reactive({
  title: '',
  date: '',
  location: ''
})

function initForm() {
  Object.assign(form, {
    title: props.event?.title ?? '',
    description: props.event?.description ?? '',
    date: props.event?.date ?? '',
    time: props.event?.time ?? '09:00',
    price: props.event?.price ?? 0,
    capacity: props.event?.capacity ?? 0,
    location: props.event?.location ?? '',
    category: props.event?.category ?? 'Conference'
  })
  Object.assign(errors, { title: '', date: '', location: '' })
}

function validate() {
  errors.title = form.title.trim() ? '' : 'Event title is required.'
  errors.date = form.date ? '' : 'Date is required.'
  errors.location = form.location.trim() ? '' : 'Location is required.'
  return !Object.values(errors).some(Boolean)
}

function submit() {
  if (!validate()) return

  const payload = {
    title: form.title,
    description: form.description,
    date: form.date,
    time: form.time,
    price: form.price,
    capacity: form.capacity,
    location: form.location,
    category: form.category
  }

  const saved = isEditing.value
    ? eventsStore.update(props.event.id, payload)
    : eventsStore.create(payload)

  emit('saved', saved)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (open) => {
  if (open) initForm()
})

watch(() => props.event, () => {
  if (props.modelValue) initForm()
})
</script>

<style lang="scss" scoped>
@import './EventAdminModal.scss';
</style>
