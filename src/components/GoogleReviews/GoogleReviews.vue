<template>
  <section class="reviews" aria-labelledby="reviews-heading">
    <div class="reviews__header">
      <div class="reviews__summary">
        <h2 id="reviews-heading" class="reviews__title">What our clients say</h2>
        <div class="reviews__score-row">
          <svg class="reviews__google-logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <div class="reviews__score">
            <span class="reviews__score-num">4.9</span>
            <div class="reviews__stars" role="img" aria-label="4.9 out of 5 stars">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="reviews__star reviews__star--filled" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="reviews__score-total">Based on 247 reviews</span>
          </div>
        </div>
      </div>

      <!-- Scroll arrows -->
      <div class="reviews__nav" aria-label="Scroll reviews">
        <button
          class="reviews__nav-btn"
          :class="{ 'reviews__nav-btn--disabled': atStart }"
          @click="scrollPrev"
          aria-label="Previous reviews"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
          class="reviews__nav-btn"
          :class="{ 'reviews__nav-btn--disabled': atEnd }"
          @click="scrollNext"
          aria-label="Next reviews"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Scrollable track with mouse wheel and touch scroll -->
    <div
      ref="trackRef"
      :class="['reviews__track', { 'reviews__track--dragging': isDragging }]"
      @scroll="onScroll"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      role="region"
      tabindex="0"
      aria-label="Google reviews carousel"
    >
      <article v-for="r in reviews" :key="r.id" class="reviews__card">
        <header class="reviews__card-header">
          <img :src="r.avatar" :alt="r.name" class="reviews__avatar" loading="lazy" />
          <div>
            <p class="reviews__reviewer-name">{{ r.name }}</p>
            <p class="reviews__reviewer-date">{{ r.date }}</p>
          </div>
          <svg class="reviews__card-logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </header>

        <div class="reviews__card-stars" role="img" :aria-label="`${r.rating} stars`">
          <svg
            v-for="n in 5"
            :key="n"
            viewBox="0 0 24 24"
            class="reviews__star"
            :class="{ 'reviews__star--filled': n <= r.rating }"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        <p class="reviews__card-text">{{ r.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const reviews = [
  { id: 1, name: 'Sarah Johnson',  avatar: 'https://picsum.photos/seed/rev001/60/60', rating: 5, date: '2 weeks ago',  text: 'Absolutely outstanding event organization. The Grand Pavilion was pristine and the team was incredibly professional from start to finish.' },
  { id: 2, name: 'Marcus Chen',    avatar: 'https://picsum.photos/seed/rev002/60/60', rating: 5, date: '1 month ago',  text: 'Booked the Skyline Conference Center for our product launch. The AV setup was flawless and the staff anticipated every need. Our guests were thoroughly impressed.' },
  { id: 3, name: 'Elena Vasquez',  avatar: 'https://picsum.photos/seed/rev003/60/60', rating: 4, date: '1 month ago',  text: 'Great venue options and a smooth booking process. The dedicated coordinator made the entire experience seamless. Would happily use Portaberto again.' },
  { id: 4, name: "James O'Brien",  avatar: 'https://picsum.photos/seed/rev004/60/60', rating: 5, date: '2 months ago', text: 'The Meridian Hall is world-class. Hosted our annual summit here and everything went perfectly. Highly professional team throughout.' },
  { id: 5, name: 'Priya Sharma',   avatar: 'https://picsum.photos/seed/rev005/60/60', rating: 5, date: '2 months ago', text: 'Third time using Portaberto for our charity gala. Consistently excellent. The Azure Terrace looked magical and the team handled last-minute changes without any fuss.' },
  { id: 6, name: 'Thomas Müller',  avatar: 'https://picsum.photos/seed/rev006/60/60', rating: 5, date: '3 months ago', text: 'From inquiry to post-event follow-up, every touchpoint was handled with care. The Crystal Gallery was exactly as described.' },
  { id: 7, name: 'Aisha Nkosi',    avatar: 'https://picsum.photos/seed/rev007/60/60', rating: 5, date: '3 months ago', text: 'We hosted a 300-person gala at Heritage Ballroom and not a single detail was overlooked. The catering coordination and lighting setup exceeded every expectation.' },
  { id: 8, name: 'Laurent Dubois', avatar: 'https://picsum.photos/seed/rev008/60/60', rating: 4, date: '4 months ago', text: 'Excellent communication from the team. The venue was immaculate and the pricing was very competitive for the quality offered. Will be back.' },
]

const trackRef = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragScrollLeft = ref(0)

function onScroll() {
  const t = trackRef.value
  if (!t) return
  atStart.value = t.scrollLeft <= 4
  atEnd.value   = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
}

function scrollPrev() {
  scrollByTrack(-1)
}

function scrollNext() {
  scrollByTrack(1)
}

function scrollByTrack(direction) {
  const track = trackRef.value
  if (!track) return
  track.scrollBy({ left: direction * track.clientWidth * 0.88, behavior: 'smooth' })
}

function onWheel(e) {
  const track = trackRef.value
  if (!track) return
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const canRight = track.scrollLeft < track.scrollWidth - track.clientWidth - 1
  const canLeft  = track.scrollLeft > 1
  if ((delta > 0 && canRight) || (delta < 0 && canLeft)) {
    e.preventDefault()
    track.scrollLeft += delta * 1.4
  }
}

function onPointerDown(e) {
  if (e.pointerType === 'touch') return
  const track = trackRef.value
  if (!track) return
  isDragging.value = true
  dragStartX.value = e.clientX
  dragScrollLeft.value = track.scrollLeft
  track.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e) {
  if (!isDragging.value || e.pointerType === 'touch') return
  const track = trackRef.value
  if (!track) return
  e.preventDefault()
  track.scrollLeft = dragScrollLeft.value - (e.clientX - dragStartX.value)
}

function stopDragging(e) {
  if (!isDragging.value) return
  isDragging.value = false
  trackRef.value?.releasePointerCapture?.(e.pointerId)
}

onMounted(() => {
  onScroll()
  trackRef.value?.addEventListener('wheel', onWheel, { passive: false })
})

onUnmounted(() => {
  isDragging.value = false
  trackRef.value?.removeEventListener('wheel', onWheel)
})
</script>

<style lang="scss" scoped>
@import './GoogleReviews.scss';
</style>
