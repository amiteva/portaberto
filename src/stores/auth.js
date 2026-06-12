import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_USERS = {
  user: { id: 1, name: 'Alex Morgan', email: 'alex@demo.com', role: 'user', avatar: 'https://picsum.photos/seed/user42/80/80' },
  admin: { id: 2, name: 'Admin', email: 'admin@portaberto.com', role: 'admin', avatar: 'https://picsum.photos/seed/admin99/80/80' }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  try { const s = localStorage.getItem('portaberto-user'); if (s) user.value = JSON.parse(s) } catch {}
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  function login(role) { user.value = MOCK_USERS[role] ?? null; if (user.value) localStorage.setItem('portaberto-user', JSON.stringify(user.value)) }
  function logout() { user.value = null; localStorage.removeItem('portaberto-user') }
  return { user, isLoggedIn, isAdmin, login, logout }
})
