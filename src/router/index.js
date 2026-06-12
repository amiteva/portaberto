import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Portaberto — Where moments find their place' }
  },
  {
    path: '/events/:id',
    name: 'event-detail',
    component: () => import('@/pages/EventDetailPage.vue'),
    meta: { title: 'Event Details — Portaberto' }
  },
  {
    path: '/venues',
    name: 'venues',
    component: () => import('@/pages/VenuesPage.vue'),
    meta: { title: 'Our Venues — Portaberto' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/VenueRequestPage.vue'),
    meta: { title: 'Contact Us — Portaberto' }
  },
  { path: '/login',       name: 'login',       component: () => import('@/pages/LoginPage.vue'),         meta: { title: 'Sign In — Portaberto' } },
  { path: '/favorites',   name: 'favorites',   component: () => import('@/pages/FavoritesPage.vue'),     meta: { title: 'Favorites — Portaberto', requiresAuth: true } },
  { path: '/my-bookings', name: 'my-bookings', component: () => import('@/pages/MyBookingsPage.vue'),    meta: { title: 'My Bookings — Portaberto', requiresAuth: true } },
  { path: '/privacy',     name: 'privacy',     component: () => import('@/pages/PrivacyPolicyPage.vue'), meta: { title: 'Privacy Policy — Portaberto' } },
  { path: '/venue-request', redirect: '/contact' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) return { name: 'login', query: { next: to.fullPath } }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Portaberto'
})

export default router
