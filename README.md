# Portaberto

A local demo app for discovering events and booking venue spaces. Built as a simple frontend project — all data is mocked and all state is local.

## Running Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

To verify the build compiles cleanly:

```bash
npm run build
npm run preview   # serves the built output locally at http://localhost:4173
```

## Tech Stack

| Layer      | Choice                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| Framework  | Vue 3 (Composition API, `<script setup>`)                                        |
| Build tool | Vite 5                                                                           |
| State      | Pinia with `localStorage` persistence                                            |
| Routing    | Vue Router 4, lazy-loaded routes                                                 |
| Styling    | SCSS, BEM, CSS custom properties for theming                                     |
| i18n       | vue-i18n — English and Macedonian                                                |
| Data       | FakerAPI (`/api/v2/custom`, `/api/v2/persons`, `/api/v2/places`) + Picsum images |
| Unit tests | Vitest + Vue Test Utils                                                          |
| E2E + a11y | Playwright + `@axe-core/playwright`                                              |

## User Roles

The app has three access levels. All auth state is local — there is no real server.

### Guest (not logged in)

- Browse and search events
- Browse venues
- View event detail pages with speaker information
- Submit the contact / venue request form
- Cannot book, favorite, or access `/my-bookings`

### Registered user (demo login: Alex Morgan)

- Everything guests can do, plus:
- Book events — choose venue, attendance details, date range, and time
- Edit and cancel their own bookings from `/my-bookings`
- Add and remove events from favorites (favorites are scoped per user profile)
- Cannot create or modify events or venues

### Admin

- Everything registered users can do, except registering for events (admin accounts cannot attend their own events)
- Create new events from the home page event grid
- Edit any event from its detail page — title, date, time, price, capacity, location, category, description
- Create new venues from the venues page
- Edit any venue — name, description, capacity, and images
- Full access to all bookings data

## Features

- **Event discovery** — browsable event grid with search, category filter, and date sort; each event links to a detail page with speakers and an image carousel
- **Event registration** — registered users open a booking modal directly from the event card or detail page; multi-day events supported with start date, end date, and time
- **Venue listings** — venue cards with image carousels and capacity; "Book this Venue" navigates to the contact form with that venue pre-selected
- **Venue / contact form** — start and end date pickers, time, expected attendance, event type, and a venue dropdown pre-filled from URL param (`?venue=<id>`)
- **My Bookings** — protected route showing all active bookings for the current user; each booking can be edited or cancelled
- **Favorites** — heart-toggle on event cards; `/favorites` page shows all saved events; state is per user profile
- **Auth** — login page with three one-click options (guest, demo user, admin); redirects back to the originally requested page after login
- **Admin tooling** — inline create/edit modals for events and venues; admin UI elements (create buttons, edit controls) are hidden for other roles
- **Theme toggle** — dark and light themes via CSS custom properties; preference persists in `localStorage`
- **Locale switcher** — English / Macedonian; locale persists in `localStorage`
- **Google Reviews section** — scrollable review carousel with mouse wheel, touch, and prev/next arrow navigation
- **Privacy Policy page** — full-content page at `/privacy`, linked from the footer and contact form

## Architecture

```text
src/
  assets/
    icons/           SVG icons
    styles/          _variables.scss, _mixins.scss, global.scss
  components/
    elements/        BaseButton, BaseInput, BaseTextarea, ImageCarousel,
                     LoadingSpinner, LocaleSwitcher, ThemeToggle
    events/          EventAdminModal, EventCard, EventFilters,
                     EventGrid, RegisterModal, SpeakerCard
    layouts/         Header, Footer
    GoogleReviews/
    VenueCard/
    EditVenueModal/
  i18n/              Locale messages (en, mk) + locale persistence
  pages/             HomePage, EventDetailPage, VenuesPage, FavoritesPage,
                     VenueRequestPage, MyBookingsPage, LoginPage, PrivacyPolicyPage
  router/            Route definitions, auth guard, scroll behavior
  services/          fakerApi.js — FakerAPI + curated fixture data
  stores/            auth, bookings, events, favorites, theme, venues
tests/
  unit/              Vitest specs for stores and shared components
  e2e/               Playwright specs for critical user flows + axe accessibility scans
```

**Data flow:** pages call Pinia store actions → stores call `fakerApi.js` → components receive data through props and store refs. All persistent client state (theme, locale, auth, bookings, favorites) lives in `localStorage`.

**Mock data:** event and venue names come from curated fixture arrays in `fakerApi.js`. Event dates are generated relative to today so they always appear in the future.

## Running Tests

```bash
# Unit tests
npm run test:unit

# E2E and accessibility (requires a build first — the script handles this)
npm run test:e2e

# Accessibility scans only
npm run test:a11y
```

Playwright requires its browser bundle the first time:

```bash
npx playwright install chromium
```

The E2E helpers stub FakerAPI responses so tests are deterministic and don't depend on the network.

## Accessibility

Skip link, semantic landmarks, accessible form labels, keyboard-navigable event cards (real `<a>` tags), ARIA labels on icon-only controls, and automated axe scans covering home, login, contact, privacy, and favorites routes.

## Possible Improvements

**Role and account system**

- **Registration page** — currently there is no sign-up flow; new users can only use the demo login. A real registration page would collect name, email, and password and create a persistent account via an auth provider (Supabase Auth, Clerk, or Auth0)
- **Admin: event cancellation with automated side-effects** — when an admin cancels an event, all bookings for that event should be automatically marked as cancelled in the bookings store, and affected users should receive an in-app notification (or email if a mail service is connected). The cancelled event should still appear in each user's booking history with a "Cancelled by organiser" status rather than disappearing silently
- **Public vs. private events** — events could carry a `visibility` field. Public events appear in the main discovery grid for everyone. Private events are only visible to users who have been explicitly invited or who have booked a venue through the contact form — surfaced in a dedicated "My Events" page as confirmation that their venue booking is confirmed and their event is being organised. Admins would set visibility when creating or editing an event
- **Organiser role** — a fourth role between user and admin: someone who has submitted a venue request and had it approved. They would see their upcoming private event in "My Events", be able to update event details (description, capacity, time), and send invites to attendees, but would not have access to platform-wide admin tools

**Payments**

- **Ticket purchasing** — events with a non-zero price should require a payment step before confirming a booking. Stripe Checkout or Stripe Elements would handle card collection, and the booking would only be confirmed after a successful payment intent. Refund logic would need to be tied to the booking cancellation flow
- **Ticket types** — general admission, VIP, early-bird — each with its own price and capacity limit, managed by the admin when creating or editing an event

**Content and data**

- Connect to a CMS like [Sanity](https://www.sanity.io) — event and venue content would be managed from a studio dashboard without touching code; GROQ queries replace the current FakerAPI calls. Sanity is a natural fit because its schema mirrors the existing data shape (events with speakers, venues with capacity and images)
- Replace Picsum placeholder images with a CDN-backed image service (Cloudinary or Imgix) for real uploads with automatic resizing and format optimization

**Discovery and communication**

- Full-text event search with Algolia or Typesense — faster and typo-tolerant compared to the current client-side string filter
- Map view on venue pages — Mapbox GL or Google Maps showing venue location with a street-level pin
- Email notifications for booking confirmations, reminders, and cancellations (Resend or SendGrid)

**Internationalisation**

- Extend translation coverage to long-form pages (EventDetail, VenueRequest, PrivacyPolicy, VenuesPage) and all form validation messages — currently only navigation, home-page controls, and a few shared components are translated

**Quality and tooling**

- CI pipeline (GitHub Actions) running unit tests, E2E tests, and a dependency audit on every push
- Lint + format enforcement (ESLint + Prettier) in CI and as a pre-commit hook
- Bundle size tracking — Vite bundle analysis and Lighthouse CI to catch performance regressions
