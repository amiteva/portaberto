import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { mockFakerApi } from './helpers'

const routes = ['/', '/login', '/contact', '/privacy']

for (const route of routes) {
  test(`has no detectable accessibility violations on ${route}`, async ({ page }) => {
    await mockFakerApi(page)
    await page.goto(route)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}

test('has no detectable accessibility violations on /favorites for signed-in users', async ({ page }) => {
  await mockFakerApi(page)
  await page.addInitScript(() => {
    localStorage.setItem('eventus-user', JSON.stringify({
      id: 1,
      name: 'Alex Morgan',
      email: 'alex@demo.com',
      role: 'user',
      avatar: 'https://picsum.photos/seed/user42/80/80'
    }))
  })
  await page.goto('/favorites')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()

  expect(results.violations).toEqual([])
})
