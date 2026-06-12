import { describe, expect, it } from 'vitest'
import { i18n, setLocale } from '@/i18n'

describe('i18n', () => {
  it('switches locale and updates the document language', () => {
    setLocale('mk')

    expect(i18n.global.locale.value).toBe('mk')
    expect(document.documentElement.lang).toBe('mk')
    expect(localStorage.getItem('eventus-locale')).toBe('mk')

    setLocale('en')
  })
})
