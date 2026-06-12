# Portaberto

A local demo app for discovering events and booking venue spaces. Built as a frontend-only Vue project with mocked data and local browser state.

## Running Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

To verify the build compiles cleanly:

```bash
npm run build
npm run preview
```

`npm run preview` serves the built output locally at `http://localhost:4173`.

## Tests

```bash
# Unit tests
npm run test:unit

# E2E tests, including accessibility scans
npm run test:e2e

# Accessibility scans only
npm run test:a11y

# Full test suite
npm run test
```

Install the Playwright browser bundle once before running E2E tests locally:

```bash
npx playwright install chromium
```

## Technical Choices

| Area                  | Choice                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Framework             | Vue 3 with Composition API and `<script setup>`                                                                   |
| Build tool            | Vite 5                                                                                                            |
| Routing               | Vue Router 4 with lazy-loaded route components                                                                    |
| State                 | Pinia stores, with `localStorage` persistence for auth, theme, locale, favorites, bookings, and events            |
| Styling               | SCSS, BEM-style class names, CSS custom properties for themes, px-based sizing on a 4px scale                     |
| Themes                | Dark and light only, with dark as the default                                                                     |
| i18n                  | vue-i18n with English and Macedonian                                                                              |
| Data                  | FakerAPI-backed service helpers, curated event and venue labels, local review fixtures, Picsum placeholder images |
| Unit tests            | Vitest and Vue Test Utils                                                                                         |
| E2E and accessibility | Playwright and `@axe-core/playwright`                                                                             |

The favicon is an SVG `P` mark in `public/favicon.svg`. It works on localhost because Vite serves files from `public` at the root path.

## User Roles

The app has three access levels. Authentication is local only. There is no real server or password flow.

### Guest

- Can browse events and venues.
- Can view event details.
- Can submit the contact and venue request form.
- Cannot book events, save favorites, or open attendee pages.

### Registered User

- Can book events.
- Can edit and cancel bookings at `/my-bookings`.
- Can save events and view them at `/favorites`.
- Can submit the contact and venue request form.
- Cannot create or edit events or venues.

The current demo has one registered user profile, Alex Morgan. The booking store persists all bookings in `portaberto-bookings` and deduplicates by event plus booking email. It does not currently isolate bookings by authenticated user id beyond the email captured in the booking form.

### Admin

- Can create and edit events.
- Can cancel events without deleting the event record.
- Can create and edit venues for the active session.
- Can delete venues from the venue listing for the active session.
- Cannot register for events.
- Cannot submit the contact or venue request form.
- Cannot use `/my-bookings` or `/favorites`, because those are attendee pages.
- Direct access to attendee-only and contact-only routes redirects back to the home page.

If admin booking oversight is needed, it should be a separate admin dashboard instead of reusing `My Bookings`, because `/my-bookings` is an attendee-only route and admins are redirected away from it.

## Main Routes

| Route             | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| `/`               | Event discovery and Google reviews                              |
| `/events/:id`     | Event details, registration for users, edit controls for admins |
| `/venues`         | Venue listing and admin venue creation                          |
| `/contact`        | Venue request and contact form for guests and registered users  |
| `/login`          | Demo role selection                                             |
| `/my-bookings`    | Attendee booking management                                     |
| `/favorites`      | Attendee saved events                                           |
| `/privacy-policy` | Privacy policy                                                  |

`/privacy` redirects to `/privacy-policy` for compatibility, but the canonical route is `/privacy-policy`.

## Features

- Event discovery with search, category filters, sorting, pagination, and event cards.
- Event details with venue media, optional multiple featured speakers, user registration, favorites, admin editing, and admin cancellation.
- Venue listings with image carousels, venue request links, and admin create, edit, or delete actions.
- Contact form with venue prefill, date fields, time field, attendance, and consent.
- Favorites scoped to the signed-in attendee profile.
- Bookings persisted in `localStorage`, deduplicated per event and booking email.
- Cancelled events keep a visible cancelled tag and block registration.
- Cancelling an event automatically marks matching attendee bookings as cancelled.
- Deleting a venue cancels currently loaded events whose venue id, venue name, or location matches that venue.
- Admin-created and admin-edited events persist locally and survive reloads.
- Admin-created, edited, and deleted venues are session-only and do not survive a full reload.
- Footer with social links, email, Skopje location, contact link, and privacy navigation.
- Language switcher with labels shown in the currently selected language.
- Theme toggle with dark and light themes only.
- SVG favicon served from `public/favicon.svg`.
- Admin event forms can add multiple speakers with name, surname, position, email, and an uploaded or default profile image.
- Event forms can save an event with no speakers. In that case the event detail page hides the Featured Speakers section.
- Styling uses px values on a 4px scale for normal spacing, sizes, and typography.
- Automated unit, E2E, and accessibility test coverage for the critical flows.

## Architecture

```text
src/
  assets/
    icons/           Static SVG icon assets
    styles/          SCSS variables, mixins, and global theme tokens
  components/
    elements/        Reusable UI primitives such as BaseButton, BaseInput,
                     BaseTextarea, ImageCarousel, LoadingSpinner, LocaleSwitcher, ThemeToggle
    layouts/         Header and Footer
    EventCard/       App-level event card component
    EventFilters/    App-level filtering component
    EventGrid/       App-level event grid component
    RegisterModal/   Event registration modal
    EventAdminModal/ Event create and edit modal
    VenueCard/       Venue card component
    EditVenueModal/  Venue create and edit modal
    GoogleReviews/   Scrollable reviews section
    SpeakerCard/     Speaker preview card
  i18n/              Locale messages and locale persistence
  pages/             Route-level screens
  router/            Route definitions, guards, document titles, scroll behavior
  services/          fakerApi.js and curated fallback data
  stores/            Pinia stores for auth, bookings, events, favorites,
                     theme, and venues
tests/
  unit/              Vitest specs for stores and shared components
  e2e/               Playwright user-flow and accessibility specs
```

### Component Folder Convention

Use `pages/` for route-level screens. One page file per route is normal in Vue Router. When a page becomes large, extract its sections into components instead of adding more route files.

Use `components/elements/` for reusable primitives that do not know about app data, such as buttons, inputs, textareas, toggles, and carousels.

Use direct folders under `components/` for app-level components that know about events, venues, reviews, registration, or admin flows.

Use `components/layouts/` for shell components such as `Header` and `Footer`.

The folder is called `stores` because Pinia officially calls each state module a store. Keeping all Pinia modules in `src/stores` is the common convention.

Moving `elements` outside `components` is usually unnecessary. A separate `src/elements` or `src/ui` folder only makes sense if the app grows into a standalone design system shared by multiple apps.

## Data Flow

Pages load or mutate state through Pinia stores. Stores call `services/fakerApi.js` for event records, speaker records, and venue records. Components receive most display data through props and read shared state only when needed, such as auth status or favorite state.

FakerAPI is used for:

- Event descriptions, prices, capacities, cities, and countries.
- Speaker names and emails.
- Venue place data such as descriptions, coordinates, and source image fields.

FakerAPI is not used for:

- Google reviews. Reviews are local fixture objects inside `GoogleReviews.vue`.
- Main event image URLs. Event images are Picsum placeholder URLs.
- Speaker profile photos. Speaker photos are Picsum placeholder URLs unless uploaded in the admin form. Uploaded photos use browser object URLs and are only reliable for the active browser session.
- Review avatars. Review avatars are Picsum placeholder URLs.
- The default incognito speaker image. That file is `public/incognito-speaker.svg`.

Persistent browser state lives in `localStorage`:

- Theme preference
- Locale preference
- Current demo user
- Bookings
- Favorites
- Created, edited, or cancelled events

The local storage keys are:

- `portaberto-theme`
- `portaberto-locale`
- `portaberto-user`
- `portaberto-bookings`
- `portaberto-favorites`
- `portaberto-events`

Booking behavior:

- `portaberto-bookings` stores booking records globally for the demo app.
- New registrations prefill the logged-in user's name and email.
- Duplicate bookings for the same event and email are collapsed into one record.
- If any duplicate copy is cancelled, the merged booking stays cancelled.
- Cancelling an event marks all bookings for that event as cancelled.

Event admin behavior:

- `portaberto-events` stores admin-created events, admin-edited events, and event cancellation state.
- Stored event data is merged over FakerAPI event data on load, so cancelled or edited events stay changed after reload.
- Events can have zero speakers, one speaker, or multiple speakers.

Venue admin behavior:

- Venue create, edit, and delete actions are currently kept in Pinia memory for the active session after loading FakerAPI data.
- Venues do not have a `localStorage` key yet.
- Deleting a venue calls the event store to cancel currently loaded events matched by venue id, venue name, or event location, then cancels matching bookings by event id.

## Accessibility

- Semantic landmarks for header, main content, and footer.
- Skip link for keyboard users.
- Real links for event details and navigation.
- ARIA labels for icon-only buttons.
- Keyboard-operable dropdowns, toggles, modals, and carousel controls.
- Automated axe scans for home, login, contact, privacy policy, and favorites flows. The current Playwright accessibility spec disables axe's `color-contrast` rule.

## Performance Notes

- Route components are lazy-loaded through Vue Router.
- The Google reviews section is loaded with `defineAsyncComponent` on the home page.
- The hero image uses `fetchpriority="high"` and async decoding.
- Build output is verified locally through `npm run build`.
- Future image optimization should replace external Picsum placeholders with optimized uploaded assets.

## Possible Improvements

- Add a real backend with persisted auth, events, venues, bookings, and favorites.
- Add a dedicated admin dashboard for all bookings, attendee lists, event cancellation, and venue request approval.
- Add a real registration flow instead of the demo login options.
- Add payments through Stripe for paid tickets.
- Add ticket types such as general admission, VIP, and early bird.
- Replace Picsum placeholder images with uploaded assets served through Cloudinary or Imgix.
- Connect event and venue content to a CMS such as Sanity.
- Add email notifications for booking confirmations, reminders, and cancellations.
- Add a map view for venue discovery.
- Extend translations to every long-form page and every validation message.
- Add CI with unit tests, E2E tests, accessibility scans, linting, formatting, and bundle-size checks.
