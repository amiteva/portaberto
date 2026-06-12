import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { i18n, initLocale } from './i18n'
import '@/assets/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize theme before mounting so the correct class is applied from the start
const themeStore = useThemeStore()
themeStore.init()
initLocale()

app.mount('#app')
