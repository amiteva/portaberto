<template>
  <a class="skip-link" href="#main-content">{{ t('a11y.skipToContent') }}</a>
  <Header />
  <span id="main-content" class="skip-target" tabindex="-1" />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <Footer :class="{ 'footer--compact': isLoginRoute }" />
</template>

<script setup>
import { computed, onUnmounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/components/layouts/Header/Header.vue'
import Footer from '@/components/layouts/Footer/Footer.vue'

const route = useRoute()
const isLoginRoute = computed(() => route.name === 'login')
const { t } = useI18n()

watchEffect(() => {
  document.body.classList.toggle('is-login-route', isLoginRoute.value)
})

onUnmounted(() => {
  document.body.classList.remove('is-login-route')
})
</script>
