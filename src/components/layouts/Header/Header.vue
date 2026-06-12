<template>
  <header :class="['header', { 'header--scrolled': isScrolled }]" role="banner">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" aria-label="Portaberto home">
        <span class="header__logo-mark">Portaberto</span>
      </RouterLink>

      <nav class="header__nav" :aria-label="t('a11y.mainNavigation')">
        <RouterLink to="/" class="header__nav-item" exact-active-class="header__nav-item--active">
          {{ t('nav.events') }}
        </RouterLink>
        <RouterLink to="/venues" class="header__nav-item" active-class="header__nav-item--active">
          {{ t('nav.venues') }}
        </RouterLink>
        <RouterLink v-if="!authStore.isAdmin" to="/contact" class="header__nav-item" active-class="header__nav-item--active">
          {{ t('nav.contact') }}
        </RouterLink>
        <RouterLink v-if="canUseAttendeePages" to="/my-bookings" class="header__nav-item" active-class="header__nav-item--active">
          {{ t('nav.myBookings') }}
        </RouterLink>
        <RouterLink v-if="canUseAttendeePages" to="/favorites" class="header__nav-item" active-class="header__nav-item--active">
          {{ t('nav.favorites') }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <LocaleSwitcher />
        <ThemeToggle />

        <!-- Logged-in user info -->
        <div v-if="authStore.isLoggedIn" class="header__user">
          <img :src="authStore.user.avatar" class="header__user-avatar" :alt="authStore.user.name" />
          <span class="header__user-name">{{ authStore.user.name }}</span>
          <button class="header__signout" @click="signOut" :aria-label="t('a11y.signOut')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

        <!-- Sign in CTA (not logged in) -->
        <RouterLink v-else to="/login" class="header__cta-wrap">
          <BaseButton size="sm">{{ t('nav.signIn') }}</BaseButton>
        </RouterLink>

        <button
          class="header__burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="t('a11y.toggleNavigation')"
          @click="menuOpen = !menuOpen"
        >
          <span class="header__burger-line" :class="{ 'header__burger-line--open-1': menuOpen }" />
          <span class="header__burger-line" :class="{ 'header__burger-line--open-2': menuOpen }" />
          <span class="header__burger-line" :class="{ 'header__burger-line--open-3': menuOpen }" />
        </button>
      </div>
    </div>

    <Transition name="slide-down">
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="header__mobile-menu"
        :aria-label="t('a11y.mobileNavigation')"
      >
        <RouterLink to="/"        class="header__mobile-item" exact-active-class="header__mobile-item--active" @click="menuOpen = false">{{ t('nav.events') }}</RouterLink>
        <RouterLink to="/venues"  class="header__mobile-item" active-class="header__mobile-item--active"       @click="menuOpen = false">{{ t('nav.venues') }}</RouterLink>
        <RouterLink v-if="!authStore.isAdmin" to="/contact" class="header__mobile-item" active-class="header__mobile-item--active"       @click="menuOpen = false">{{ t('nav.contact') }}</RouterLink>
        <RouterLink v-if="canUseAttendeePages" to="/my-bookings" class="header__mobile-item" active-class="header__mobile-item--active" @click="menuOpen = false">{{ t('nav.myBookings') }}</RouterLink>
        <RouterLink v-if="canUseAttendeePages" to="/favorites" class="header__mobile-item" active-class="header__mobile-item--active" @click="menuOpen = false">{{ t('nav.favorites') }}</RouterLink>
        <div class="header__mobile-bottom">
          <LocaleSwitcher />
          <ThemeToggle />
          <div v-if="authStore.isLoggedIn" class="header__mobile-user">
            <span class="header__mobile-username">{{ authStore.user.name }}</span>
            <button class="header__mobile-signout" @click="signOut">{{ t('nav.signOut') }}</button>
          </div>
          <RouterLink v-else to="/login" @click="menuOpen = false">
            <BaseButton size="sm">{{ t('nav.signIn') }}</BaseButton>
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/elements/BaseButton/BaseButton.vue'
import LocaleSwitcher from '@/components/elements/LocaleSwitcher/LocaleSwitcher.vue'
import ThemeToggle from '@/components/elements/ThemeToggle/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const isScrolled = ref(false)
const menuOpen   = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const canUseAttendeePages = computed(() => authStore.isLoggedIn && !authStore.isAdmin)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

function signOut() {
  authStore.logout()
  menuOpen.value = false
  router.push('/')
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style lang="scss" scoped>
@import './Header.scss';
</style>
