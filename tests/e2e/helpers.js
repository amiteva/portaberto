export async function mockFakerApi(page) {
  await page.route('https://fakerapi.it/api/v2/**', async (route) => {
    const url = new URL(route.request().url())
    const quantity = Number(url.searchParams.get('_quantity') ?? 12)
    const data = Array.from({ length: quantity }, (_, index) => ({
      id: index + 1,
      description: `Generated description ${index + 1}`,
      price: 120 + index,
      seats: 100 + index,
      city: 'Stockholm',
      country: 'Sweden',
      firstname: `Speaker${index + 1}`,
      lastname: 'Demo',
      email: `speaker${index + 1}@example.com`,
      image: { url: `https://picsum.photos/seed/test-${index + 1}/900/500` },
      latitude: 59.3293,
      longitude: 18.0686
    }))

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data })
    })
  })
}
