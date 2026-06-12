<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="$emit('update:modelValue', false)"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <Transition name="slide-up">
          <div v-if="modelValue" class="modal">
            <button
              class="modal__close"
              aria-label="Close registration form"
              @click="$emit('update:modelValue', false)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Thank-you state -->
            <Transition name="fade" mode="out-in">
              <div v-if="submitted" class="modal__thankyou" key="thankyou">
                <div class="modal__thankyou-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 class="modal__thankyou-title">You're registered!</h2>
                <p>A confirmation has been sent to <strong>{{ form.email }}</strong>.</p>
                <p>We look forward to seeing you at <em>{{ event?.title }}</em>.</p>
                <BaseButton class="modal__thankyou-btn" @click="$emit('update:modelValue', false)">
                  Close
                </BaseButton>
              </div>

              <!-- Form state -->
              <div v-else key="form" class="modal__content">
                <header class="modal__header">
                  <span class="modal__category">{{ event?.category }}</span>
                  <h2 :id="titleId" class="modal__title">Register for Event</h2>
                  <p class="modal__subtitle">{{ event?.title }}</p>
                </header>

                <form class="modal__form" novalidate @submit.prevent="submit">
                  <div class="modal__form-grid">
                    <BaseInput
                      v-model="form.firstName"
                      label="First name"
                      required
                      :error="errors.firstName"
                      autocomplete="given-name"
                    />
                    <BaseInput
                      v-model="form.lastName"
                      label="Last name"
                      required
                      :error="errors.lastName"
                      autocomplete="family-name"
                    />
                    <BaseInput
                      v-model="form.email"
                      label="Email address"
                      type="email"
                      required
                      :error="errors.email"
                      autocomplete="email"
                      class="modal__form-full"
                    />
                    <div class="modal__seats modal__form-full">
                      <label class="modal__seats-label" for="seats-input">
                        Number of seats
                      </label>
                      <div class="modal__seats-control">
                        <button type="button" class="modal__seats-btn" aria-label="Decrease seats" @click="form.seats = Math.max(1, form.seats - 1)">−</button>
                        <input
                          id="seats-input"
                          v-model.number="form.seats"
                          type="number"
                          min="1"
                          max="10"
                          class="modal__seats-input"
                          aria-label="Number of seats"
                        />
                        <button type="button" class="modal__seats-btn" aria-label="Increase seats" @click="form.seats = Math.min(10, form.seats + 1)">+</button>
                      </div>
                    </div>
                  </div>

                  <label class="modal__checkbox">
                    <input v-model="form.terms" type="checkbox" class="modal__checkbox-input" required />
                    <span class="modal__checkbox-box" :class="{ 'modal__checkbox-box--checked': form.terms }" aria-hidden="true">
                      <svg v-if="form.terms" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span class="modal__checkbox-text">I agree to the terms and conditions</span>
                  </label>
                  <p v-if="errors.terms" class="modal__error" role="alert">{{ errors.terms }}</p>

                  <div class="modal__actions">
                    <BaseButton variant="outlined" type="button" @click="$emit('update:modelValue', false)">
                      Cancel
                    </BaseButton>
                    <BaseButton type="submit" :loading="submitting">
                      Confirm Registration
                    </BaseButton>
                  </div>
                </form>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import BaseInput from '@/components/elements/BaseInput/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  event:      { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

const titleId = 'register-modal-title'
const submitted = ref(false)
const submitting = ref(false)

const form = reactive({ firstName: '', lastName: '', email: '', seats: 1, terms: false })
const errors = reactive({ firstName: '', lastName: '', email: '', terms: '' })

function validate() {
  errors.firstName = form.firstName.trim() ? '' : 'First name is required.'
  errors.lastName  = form.lastName.trim()  ? '' : 'Last name is required.'
  errors.email     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.terms     = form.terms ? '' : 'You must accept the terms.'
  return !Object.values(errors).some(Boolean)
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 800)) // simulate API call
  if (props.event) {
    bookingsStore.add({
      event: props.event,
      seats: form.seats,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email
    })
  }
  submitting.value = false
  submitted.value = true
}

// Reset form and pre-fill from auth whenever modal is opened
watch(() => props.modelValue, (open) => {
  if (open) {
    submitted.value = false
    submitting.value = false
    const user = authStore.user
    Object.assign(form, {
      firstName: user ? (user.name.split(' ')[0] ?? '') : '',
      lastName: user ? (user.name.split(' ').slice(1).join(' ') ?? '') : '',
      email: user?.email ?? '',
      seats: 1,
      terms: false
    })
    Object.assign(errors, { firstName: '', lastName: '', email: '', terms: '' })
  }
})
</script>

<style lang="scss" scoped>
@import './RegisterModal.scss';
</style>
