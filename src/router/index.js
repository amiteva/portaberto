import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Portaberto | Where moments find their place' }
  },
  {
    path: '/events/:id',
    name: 'event-detail',
    component: () => import('@/pages/EventDetailPage.vue'),
    meta: { title: 'Event Details | Portaberto' }
  },
  {
    path: '/venues',
    name: 'venues',
    component: () => import('@/pages/VenuesPage.vue'),
    meta: { title: 'Our Venues | Portaberto' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/VenueRequestPage.vue'),
    meta: { title: 'Contact Us | Portaberto', blockAdmin: true }
  },
  { path: '/login',          name: 'login',       component: () => import('@/pages/LoginPage.vue'),         meta: { title: 'Sign In | Portaberto' } },
  { path: '/favorites',      name: 'favorites',   component: () => import('@/pages/FavoritesPage.vue'),     meta: { title: 'Favorites | Portaberto', requiresAuth: true, attendeeOnly: true } },
  { path: '/my-bookings',    name: 'my-bookings', component: () => import('@/pages/MyBookingsPage.vue'),    meta: { title: 'My Bookings | Portaberto', requiresAuth: true, attendeeOnly: true } },
  { path: '/privacy-policy', name: 'privacy',     component: () => import('@/pages/PrivacyPolicyPage.vue'), meta: { title: 'Privacy Policy | Portaberto' } },
  { path: '/privacy', redirect: '/privacy-policy' },
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
  const auth = useAuthStore()
  if (to.meta.blockAdmin && auth.isAdmin) return { name: 'home' }

  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) return { name: 'login', query: { next: to.fullPath } }
    if (to.meta.attendeeOnly && auth.isAdmin) return { name: 'home' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Portaberto'
})

export default router
