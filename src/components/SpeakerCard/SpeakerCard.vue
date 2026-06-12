<template>
  <div class="speaker-card">
    <img
      :src="speaker.photo || '/incognito-speaker.svg'"
      :alt="`Photo of ${speaker.name || 'speaker'}`"
      class="speaker-card__photo"
      loading="lazy"
      @error="onImgError"
    />
    <div class="speaker-card__info">
      <p class="speaker-card__name">{{ speaker.name }}</p>
      <p class="speaker-card__title">{{ speaker.jobTitle || speaker.position }}</p>
      <p class="speaker-card__email">{{ speaker.email }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  speaker: { type: Object, required: true }
})

function onImgError(e) {
  e.target.src = '/incognito-speaker.svg'
}
</script>

<style lang="scss" scoped>
@import './SpeakerCard.scss';
</style>
