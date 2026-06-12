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
                <BaseInput v-model="form.price" label="Price" type="number" />
                <BaseInput v-model="form.capacity" label="Capacity" type="number" />
              </div>

              <BaseInput v-model="form.location" label="Location" required :error="errors.location" />

              <div class="event-admin-modal__field-group">
                <label class="event-admin-modal__label" for="event-category-select">Category</label>
                <select id="event-category-select" v-model="form.category" class="event-admin-modal__select">
                  <option value="">Select category</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>

              <section class="event-admin-modal__speakers" aria-labelledby="event-speakers-title">
                <div class="event-admin-modal__section-head">
                  <div>
                    <h3 id="event-speakers-title" class="event-admin-modal__section-title">Featured Speakers</h3>
                    <p class="event-admin-modal__section-note">Add one or more speakers for this event.</p>
                  </div>
                  <BaseButton variant="outlined" size="sm" type="button" @click="addSpeaker">
                    Add Speaker
                  </BaseButton>
                </div>

                <div v-if="form.speakers.length" class="event-admin-modal__speaker-list">
                  <article
                    v-for="(speaker, index) in form.speakers"
                    :key="speaker.id"
                    class="event-admin-modal__speaker"
                  >
                    <div class="event-admin-modal__speaker-media">
                      <img
                        :src="speaker.photo || DEFAULT_SPEAKER_PHOTO"
                        :alt="speaker.firstName || speaker.lastName ? `${speaker.firstName} ${speaker.lastName}`.trim() : 'Default speaker profile'"
                        class="event-admin-modal__speaker-photo"
                      />
                      <label class="event-admin-modal__upload">
                        <span>Upload photo</span>
                        <input type="file" accept="image/*" @change="onSpeakerPhotoChange(index, $event)" />
                      </label>
                    </div>

                    <div class="event-admin-modal__speaker-fields">
                      <div class="event-admin-modal__grid event-admin-modal__grid--speaker">
                        <BaseInput v-model="speaker.firstName" label="Name" required :error="speaker.errors.firstName" />
                        <BaseInput v-model="speaker.lastName" label="Surname" required :error="speaker.errors.lastName" />
                      </div>
                      <BaseInput v-model="speaker.position" label="Position" required :error="speaker.errors.position" />
                      <BaseInput v-model="speaker.email" label="Email" type="email" required :error="speaker.errors.email" />
                    </div>

                    <button
                      type="button"
                      class="event-admin-modal__remove-speaker"
                      :aria-label="`Remove speaker ${index + 1}`"
                      @click="removeSpeaker(index)"
                    >
                      Remove
                    </button>
                  </article>
                </div>
              </section>
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
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useEventsStore } from '@/stores/events'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import BaseInput from '@/components/elements/BaseInput/BaseInput.vue'
import BaseTextarea from '@/components/elements/BaseTextarea/BaseTextarea.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  event: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])
useBodyScrollLock(() => props.modelValue)
const eventsStore = useEventsStore()
const categories = ['Conference', 'Workshop', 'Gala', 'Exhibition', 'Summit', 'Symposium']
const DEFAULT_SPEAKER_PHOTO = '/incognito-speaker.svg'

const isEditing = computed(() => !!props.event)

const form = reactive({
  title: '',
  description: '',
  date: '',
  time: '',
  price: '',
  capacity: '',
  location: '',
  category: '',
  speakers: []
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
    time: props.event?.time ?? '',
    price: props.event?.price ?? '',
    capacity: props.event?.capacity ?? '',
    location: props.event?.location ?? '',
    category: props.event?.category ?? '',
    speakers: getInitialSpeakers()
  })
  Object.assign(errors, { title: '', date: '', location: '' })
}

function validate() {
  errors.title = form.title.trim() ? '' : 'Event title is required.'
  errors.date = form.date ? '' : 'Date is required.'
  errors.location = form.location.trim() ? '' : 'Location is required.'

  form.speakers.forEach((speaker) => {
    speaker.errors.firstName = speaker.firstName.trim() ? '' : 'Name is required.'
    speaker.errors.lastName = speaker.lastName.trim() ? '' : 'Surname is required.'
    speaker.errors.position = speaker.position.trim() ? '' : 'Position is required.'
    speaker.errors.email = speaker.email.trim() ? '' : 'Email is required.'
  })

  const hasSpeakerErrors = form.speakers.some((speaker) => Object.values(speaker.errors).some(Boolean))
  return !Object.values(errors).some(Boolean) && !hasSpeakerErrors
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
    category: form.category,
    speakers: normalizeSpeakers()
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

function createEmptySpeaker() {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    photo: '',
    errors: createSpeakerErrors()
  }
}

function createSpeakerErrors() {
  return {
    firstName: '',
    lastName: '',
    position: '',
    email: ''
  }
}

function splitSpeakerName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ')
  }
}

function getInitialSpeakers() {
  const source = Array.isArray(props.event?.speakers)
    ? props.event.speakers
    : (props.event?.speaker ? [props.event.speaker] : [])

  return source.map((speaker) => {
    const splitName = splitSpeakerName(speaker.name)
    return {
      id: speaker.id ?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      firstName: speaker.firstName ?? splitName.firstName,
      lastName: speaker.lastName ?? splitName.lastName,
      position: speaker.position ?? speaker.jobTitle ?? '',
      email: speaker.email ?? '',
      photo: speaker.photo ?? DEFAULT_SPEAKER_PHOTO,
      errors: createSpeakerErrors()
    }
  })
}

function addSpeaker() {
  form.speakers.push(createEmptySpeaker())
}

function removeSpeaker(index) {
  form.speakers.splice(index, 1)
}

function onSpeakerPhotoChange(index, event) {
  const file = event.target.files?.[0]
  if (!file) return
  form.speakers[index].photo = URL.createObjectURL(file)
}

function normalizeSpeakers() {
  return form.speakers
    .map((speaker, index) => {
      const firstName = speaker.firstName.trim()
      const lastName = speaker.lastName.trim()
      const position = speaker.position.trim()
      const email = speaker.email.trim()
      const photo = speaker.photo || DEFAULT_SPEAKER_PHOTO

      return {
        id: speaker.id ?? index + 1,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim() || `Speaker ${index + 1}`,
        position,
        jobTitle: position,
        email,
        photo
      }
    })
    .filter(Boolean)
}
</script>

<style lang="scss" scoped>
@import './EventAdminModal.scss';
</style>
