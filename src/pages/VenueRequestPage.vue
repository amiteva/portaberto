<template>
  <main>
    <!-- Hero -->
    <section class="venue-hero" aria-label="Venue request hero">
      <div class="venue-hero__media">
        <img
          src="https://picsum.photos/seed/contacthero/1920/700"
          alt="Portaberto venue"
          class="venue-hero__img"
        />
      </div>
      <div class="venue-hero__content">
        <h5 class="venue-hero__eyebrow">Your event starts here</h5>
        <h1 class="venue-hero__title">Contact<br />Us</h1>
        <p class="venue-hero__lead">
          Tell us about your event and our team will get back to you within 24
          hours.
        </p>
      </div>
    </section>

    <!-- Form section -->
    <section class="venue-form-section" aria-labelledby="form-heading">
      <!-- Left: description -->
      <div class="venue-form-section__info">
        <h2 id="form-heading" class="venue-form-section__title">
          Let's make it happen
        </h2>
        <p class="venue-form-section__body">
          Whether you're planning an intimate gathering or a large-scale
          conference, our venues offer flexible spaces for every occasion. Fill
          in the form and a member of our team will reach out with tailored
          recommendations. Not sure which venue suits your event best? Leave us
          a message and we'll handpick the perfect spaces to match every
          requirement.
        </p>
        <ul class="venue-form-section__features">
          <li
            v-for="f in features"
            :key="f"
            class="venue-form-section__feature"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ f }}
          </li>
        </ul>
      </div>

      <!-- Right: form -->
      <div class="venue-form-section__form-wrap">
        <Transition name="fade" mode="out-in">
          <!-- Thank-you -->
          <div v-if="submitted" key="thanks" class="venue-thankyou">
            <div class="venue-thankyou__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="venue-thankyou__title">Request received!</h2>
            <p>
              We'll be in touch within 24 hours to discuss
              <strong>{{ form.venueName || "your event" }}</strong
              >{{ selectedVenueName ? ` at ${selectedVenueName}` : "" }}.
            </p>
            <BaseButton @click="resetForm">Submit another request</BaseButton>
          </div>

          <!-- Form -->
          <form
            v-else
            key="form"
            class="venue-form"
            novalidate
            @submit.prevent="submit"
          >
            <!-- Event details -->
            <fieldset class="venue-form__fieldset">
              <legend class="venue-form__legend">Event Details</legend>
              <div class="venue-form__grid">
                <div class="venue-form__select-wrap venue-form__full">
                  <select
                    id="venue-select"
                    v-model="form.venueId"
                    class="venue-form__select"
                    aria-label="Preferred venue"
                  >
                    <option value="">No preference, help me decide</option>
                    <option
                      v-for="v in venuesStore.venues"
                      :key="v.id"
                      :value="v.id"
                    >
                      {{ v.name }} - up to {{ v.capacity }} guests
                    </option>
                  </select>
                </div>
                <BaseInput
                  v-model="form.venueName"
                  label="Event name"
                  required
                  :error="errors.venueName"
                  class="venue-form__full"
                />
                <BaseInput
                  v-model="form.startDate"
                  label="Start date"
                  type="date"
                  required
                  :error="errors.startDate"
                />
                <BaseInput
                  v-model="form.endDate"
                  label="End date (optional)"
                  type="date"
                />
                <BaseInput
                  v-model="form.startTime"
                  label="Start time (optional)"
                  type="time"
                />
                <BaseInput
                  v-model="form.attendance"
                  label="Expected attendance"
                  type="number"
                  :error="errors.attendance"
                />
              </div>

              <div
                class="venue-form__radios"
                role="group"
                aria-label="Event type"
              >
                <p class="venue-form__radio-label">Event type</p>
                <div class="venue-form__radio-group">
                  <label
                    v-for="type in eventTypes"
                    :key="type"
                    class="venue-form__radio"
                  >
                    <input
                      v-model="form.eventType"
                      type="radio"
                      :value="type"
                      class="venue-form__radio-input"
                    />
                    <span
                      class="venue-form__radio-circle"
                      :class="{
                        'venue-form__radio-circle--selected':
                          form.eventType === type,
                      }"
                      aria-hidden="true"
                    />
                    {{ type }}
                  </label>
                </div>
              </div>
            </fieldset>

            <!-- Contact details -->
            <fieldset class="venue-form__fieldset">
              <legend class="venue-form__legend">Contact Details</legend>
              <div class="venue-form__grid">
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
                />
                <BaseInput
                  v-model="form.phone"
                  label="Phone number"
                  type="tel"
                  autocomplete="tel"
                />
              </div>
            </fieldset>

            <!-- Message -->
            <BaseTextarea
              v-model="form.message"
              label="Additional requirements or notes"
              :rows="5"
            />

            <!-- Terms + submit -->
            <label class="venue-form__checkbox">
              <input
                v-model="form.terms"
                type="checkbox"
                class="venue-form__checkbox-input"
              />
              <span
                class="venue-form__checkbox-box"
                :class="{ 'venue-form__checkbox-box--checked': form.terms }"
                aria-hidden="true"
              >
                <svg
                  v-if="form.terms"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span
                >I agree to the
                <RouterLink to="/privacy-policy" class="venue-form__link"
                  >privacy policy</RouterLink
                >
                and terms of service.</span
              >
            </label>
            <p v-if="errors.terms" class="venue-form__error" role="alert">
              {{ errors.terms }}
            </p>

            <div class="venue-form__actions">
              <BaseButton type="submit" size="lg" :loading="submitting">
                Send Request
              </BaseButton>
            </div>
          </form>
        </Transition>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import BaseButton from "@/components/elements/BaseButton/BaseButton.vue";
import BaseInput from "@/components/elements/BaseInput/BaseInput.vue";
import BaseTextarea from "@/components/elements/BaseTextarea/BaseTextarea.vue";
import { useVenuesStore } from "@/stores/venues";

const route = useRoute();
const venuesStore = useVenuesStore();

const eventTypes = [
  "Conference",
  "Workshop",
  "Gala",
  "Exhibition",
  "Summit",
  "Other",
];
const features = [
  "Flexible spaces from 20 to 2 000 guests",
  "State-of-the-art AV equipment",
  "Dedicated event coordinator",
  "Catering partnerships on request",
  "Central locations across Europe",
];

const submitted = ref(false);
const submitting = ref(false);

const pendingVenue = route.query.venue ?? route.query.venueId ?? "";

const form = reactive({
  venueId: "",
  venueName: "",
  startDate: "",
  endDate: "",
  startTime: "",
  attendance: "",
  eventType: "Conference",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  terms: false,
});

const errors = reactive({
  venueName: "",
  startDate: "",
  firstName: "",
  lastName: "",
  email: "",
  terms: "",
});

const selectedVenueName = computed(() => {
  const v = venuesStore.venues.find(
    (x) => String(x.id) === String(form.venueId),
  );
  return v ? v.name : null;
});

function validate() {
  errors.venueName = form.venueName.trim() ? "" : "Event name is required.";
  errors.startDate = form.startDate ? "" : "Please choose a start date.";
  errors.firstName = form.firstName.trim() ? "" : "First name is required.";
  errors.lastName = form.lastName.trim() ? "" : "Last name is required.";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? ""
    : "Enter a valid email.";
  errors.terms = form.terms ? "" : "You must accept the terms.";
  return !Object.values(errors).some(Boolean);
}

async function submit() {
  if (!validate()) return;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 900));
  submitting.value = false;
  submitted.value = true;
}

function resetForm() {
  submitted.value = false;
  Object.assign(form, {
    venueId: "",
    venueName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    attendance: "",
    eventType: "Conference",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    terms: false,
  });
  Object.assign(errors, {
    venueName: "",
    startDate: "",
    firstName: "",
    lastName: "",
    email: "",
    terms: "",
  });
}

onMounted(async () => {
  await venuesStore.load();
  if (pendingVenue) form.venueId = pendingVenue;
});
</script>

<style lang="scss" scoped>
@import "./VenueRequestPage.scss";
</style>
