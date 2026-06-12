<template>
  <section class="filters" :aria-label="t('filters.label')">
    <div class="filters__search">
      <svg class="filters__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="localSearch"
        type="search"
        class="filters__search-input"
        :placeholder="t('filters.searchPlaceholder')"
        :aria-label="t('filters.searchLabel')"
        @input="emit('update:search', localSearch)"
      />
      <button
        v-if="localSearch"
        class="filters__search-clear"
        :aria-label="t('filters.clearSearch')"
        @click="localSearch = ''; emit('update:search', '')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="filters__categories" role="group" :aria-label="t('filters.categoryLabel')">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filters__cat-btn', { 'filters__cat-btn--active': category === cat }]"
        :aria-pressed="category === cat"
        @click="emit('update:category', cat)"
      >
        {{ t(`filters.categories.${cat}`) }}
      </button>
    </div>

    <div class="filters__sort">
      <label for="sort-select" class="filters__sort-label">{{ t('filters.sortBy') }}</label>
      <select
        id="sort-select"
        :value="sort"
        class="filters__sort-select"
        @change="emit('update:sort', $event.target.value)"
      >
        <option value="date-asc">{{ t('filters.sort.dateAsc') }}</option>
        <option value="date-desc">{{ t('filters.sort.dateDesc') }}</option>
        <option value="price-asc">{{ t('filters.sort.priceAsc') }}</option>
        <option value="price-desc">{{ t('filters.sort.priceDesc') }}</option>
        <option value="name-asc">{{ t('filters.sort.nameAsc') }}</option>
      </select>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  search:   { type: String, default: '' },
  category: { type: String, default: 'All' },
  sort:     { type: String, default: 'date-asc' }
})

const emit = defineEmits(['update:search', 'update:category', 'update:sort'])
const { t } = useI18n()

const categories = ['All', 'Conference', 'Workshop', 'Gala', 'Exhibition', 'Summit', 'Symposium']
const localSearch = ref(props.search)

watch(() => props.search, (v) => { localSearch.value = v })
</script>

<style lang="scss" scoped>
@import './EventFilters.scss';
</style>
