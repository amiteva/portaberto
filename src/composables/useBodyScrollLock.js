import { watchEffect, onUnmounted } from 'vue'

export function useBodyScrollLock(isOpen) {
  watchEffect(() => {
    document.body.style.overflow = isOpen() ? 'hidden' : ''
  })

  onUnmounted(() => {
    document.body.style.overflow = ''
  })
}
