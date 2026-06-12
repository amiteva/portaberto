<template>
  <main class="login">
    <!-- Left hero panel -->
    <div class="login__hero">
      <img
        src="https://picsum.photos/seed/loginbg/1200/900"
        :alt="t('login.heroAlt')"
        class="login__hero-img"
        decoding="async"
      />
      <div class="login__hero-overlay">
        <p class="login__hero-brand">Portaberto</p>
        <p class="login__hero-tagline">{{ t('login.tagline') }}</p>
      </div>
    </div>

    <!-- Right panel -->
    <div class="login__panel">
      <div class="login__panel-inner">
        <h1 class="login__title">{{ t('login.title') }}</h1>
        <p class="login__subtitle">{{ t('login.subtitle') }}</p>

        <div class="login__options">
          <!-- Guest -->
          <button class="login__option" @click="continueAsGuest()">
            <div class="login__option-left">
              <div class="login__option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <div class="login__option-text">
                <span class="login__option-name">{{ t('login.guestName') }}</span>
                <span class="login__option-desc">{{ t('login.guestDescription') }}</span>
              </div>
            </div>
            <span class="login__option-arrow">→</span>
          </button>

          <!-- Demo User -->
          <button class="login__option" @click="loginAs('user')">
            <div class="login__option-left">
              <img
                src="https://picsum.photos/seed/user42/48/48"
                alt="Alex Morgan"
                class="login__option-avatar"
              />
              <div class="login__option-text">
                <span class="login__option-name">Alex Morgan</span>
                <span class="login__option-desc">{{ t('login.userDescription') }}</span>
              </div>
            </div>
            <span class="login__option-arrow">→</span>
          </button>

          <!-- Admin -->
          <button class="login__option" @click="loginAs('admin')">
            <div class="login__option-left">
              <img
                src="https://picsum.photos/seed/admin99/48/48"
                :alt="t('login.adminAlt')"
                class="login__option-avatar"
              />
              <div class="login__option-text">
                <span class="login__option-name">{{ t('login.adminName') }}</span>
                <span class="login__option-desc">{{ t('login.adminDescription') }}</span>
              </div>
            </div>
            <span class="login__option-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

function continueAsGuest() {
  router.push(route.query.next ?? '/')
}

function loginAs(role) {
  authStore.login(role)
  router.push(route.query.next ?? '/')
}
</script>

<style lang="scss" scoped>
@import './LoginPage.scss';
</style>
