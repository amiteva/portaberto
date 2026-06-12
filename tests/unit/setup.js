import { afterEach, beforeEach, vi } from 'vitest'
import { config } from '@vue/test-utils'

config.global.stubs = {
  RouterLink: {
    props: ['to'],
    template: '<a :href="typeof to === `string` ? to : to?.path"><slot /></a>'
  }
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })))
})

afterEach(() => {
  vi.unstubAllGlobals()
})
