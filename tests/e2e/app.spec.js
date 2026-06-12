import { expect, test } from '@playwright/test'
import { mockFakerApi } from './helpers'

test('home page renders events and supports locale switching', async ({ page }) => {
  await mockFakerApi(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Extraordinary/i })).toBeVisible()
  const desktopNav = page.getByRole('navigation', { name: /Main navigation/i })
  if (await desktopNav.count()) {
    await expect(desktopNav).toBeVisible()
  } else {
    await page.getByRole('button', { name: /Toggle navigation/i }).click()
    await expect(page.getByRole('navigation', { name: /Mobile navigation/i })).toBeVisible()
  }

  await page.getByRole('button', { name: /Choose language/i }).first().click()
  await page.getByRole('menuitemradio', { name: /Macedonian/i }).click()

  await expect(page.getByRole('link', { name: 'Настани' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /Посебни/i })).toBeVisible()
})

test('login page keeps the footer visible without document scrolling', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()

  const metrics = await page.evaluate(() => ({
    scrollingElementHeight: document.scrollingElement.scrollHeight,
    viewportHeight: window.innerHeight,
    footerText: document.querySelector('footer')?.textContent ?? ''
  }))

  expect(metrics.footerText).toContain('Portaberto')
  expect(metrics.scrollingElementHeight).toBeLessThanOrEqual(metrics.viewportHeight + 1)
})

test('keyboard users can open an event card', async ({ page }) => {
  await mockFakerApi(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const firstCard = page.getByRole('link', { name: /View details for/i }).first()
  await firstCard.focus()
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/\/events\/\d+/)
})

test('favorites page only shows favorites for attendees', async ({ page }) => {
  await mockFakerApi(page)

  await page.goto('/login')
  await page.getByRole('button', { name: /Alex Morgan/i }).click()
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /Add Global Innovation Summit to favorites/i }).click()
  await page.goto('/favorites')

  await expect(page.getByRole('heading', { name: 'Favorites' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Global Innovation Summit' })).toBeVisible()

  await page.goto('/login')
  await page.getByRole('button', { name: /Admin/i }).click()
  await page.goto('/favorites')

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Favorites' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Favorites' })).toHaveCount(0)
})

test('admin can manage events and venues without attendee registration', async ({ page }) => {
  await mockFakerApi(page)

  await page.goto('/login')
  await page.getByRole('button', { name: /Admin/i }).click()
  await expect(page.getByRole('link', { name: 'Contact' })).toHaveCount(0)
  await page.goto('/contact')
  await expect(page).toHaveURL(/\/$/)

  await page.getByRole('button', { name: 'Create Event' }).click()
  await page.getByLabel('Event title').fill('Admin Created Summit')
  await page.getByLabel('Date').fill('2026-06-13')
  await page.getByLabel('Time').fill('13:30')
  await page.getByLabel('Price').fill('150')
  await page.getByLabel('Capacity').fill('180')
  await page.getByLabel('Location').fill('Skopje, North Macedonia')
  await page.getByRole('button', { name: 'Create Event' }).last().click()

  await expect(page.getByRole('heading', { name: 'Admin Created Summit' })).toBeVisible()
  await page.getByRole('link', { name: /View details for Admin Created Summit/i }).click()
  await expect(page.getByText('Manage this event.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Register Now' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Cancel Event' })).toBeVisible()

  await page.getByRole('button', { name: 'Edit Event' }).first().click()
  await page.getByLabel('Event title').fill('Admin Updated Summit')
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByRole('heading', { name: 'Admin Updated Summit' })).toBeVisible()

  await page.goto('/venues')
  await page.getByRole('button', { name: 'Create Venue' }).click()
  await page.getByLabel('Venue name').fill('Admin Created Hall')
  await page.getByLabel('Description').fill('A venue created by the admin.')
  await page.getByLabel('Capacity').fill('260')
  await page.getByRole('button', { name: 'Create Venue' }).last().click()

  await expect(page.getByRole('heading', { name: 'Admin Created Hall' })).toBeVisible()
})
