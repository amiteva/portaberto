<template>
  <div class="carousel" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="carousel__track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <img
        v-for="(src, i) in images"
        :key="i"
        :src="src"
        :alt="`${alt} ${i + 1}`"
        class="carousel__slide"
        loading="lazy"
        decoding="async"
      />
    </div>

    <!-- Prev arrow -->
    <button
      v-if="images.length > 1"
      class="carousel__arrow carousel__arrow--prev"
      @click.stop="prev"
      aria-label="Previous image"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <!-- Next arrow -->
    <button
      v-if="images.length > 1"
      class="carousel__arrow carousel__arrow--next"
      @click.stop="next"
      aria-label="Next image"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>

    <!-- Dots -->
    <div v-if="images.length > 1" class="carousel__dots" @click.stop>
      <button
        v-for="(_, i) in images"
        :key="i"
        :class="['carousel__dot', { 'carousel__dot--active': i === current }]"
        @click.stop="current = i"
        :aria-label="`Image ${i + 1}`"
        type="button"
      />
    </div>

    <!-- Overlay slot -->
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  alt: { type: String, default: '' }
})

const current = ref(0)
let touchStartX = 0

function prev() {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}

function next() {
  current.value = (current.value + 1) % props.images.length
}

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
}

function onTouchEnd(e) {
  const delta = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(delta) > 50) {
    delta > 0 ? next() : prev()
  }
}
</script>

<style lang="scss" scoped>
@import './ImageCarousel.scss';
</style>
