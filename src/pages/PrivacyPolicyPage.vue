<template>
  <main class="privacy-page">
    <section class="privacy-page__hero">
      <div class="privacy-page__container privacy-page__hero-grid">
        <div class="privacy-page__hero-copy">
          <p class="privacy-page__eyebrow">Legal</p>
          <h1 class="privacy-page__title">Privacy Policy</h1>
          <p class="privacy-page__lead">
            How Portaberto collects, uses, stores, and protects your information across bookings,
            venue requests, and account activity.
          </p>
          <div class="privacy-page__meta">
            <span>Last updated</span>
            <strong>June 12, 2026</strong>
          </div>
        </div>

        <div class="privacy-page__hero-card" aria-label="Privacy summary">
          <p class="privacy-page__hero-card-label">At a glance</p>
          <ul class="privacy-page__hero-list">
            <li>We collect only the information needed to support bookings, venue requests, and customer service.</li>
            <li>We do not sell personal information to third parties.</li>
            <li>You can contact us at any time to access, update, or delete your data.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="privacy-page__summary">
      <div class="privacy-page__container privacy-page__summary-grid">
        <article class="privacy-page__summary-card">
          <p class="privacy-page__summary-kicker">Collect</p>
          <p>Contact details, event preferences, account activity, usage analytics, and device information.</p>
        </article>
        <article class="privacy-page__summary-card">
          <p class="privacy-page__summary-kicker">Use</p>
          <p>To process bookings, respond to enquiries, personalise recommendations, and improve the platform.</p>
        </article>
        <article class="privacy-page__summary-card">
          <p class="privacy-page__summary-kicker">Protect</p>
          <p>With technical and organisational safeguards, limited sharing, and retention tied to service needs.</p>
        </article>
      </div>
    </section>

    <section class="privacy-page__content">
      <div class="privacy-page__container privacy-page__content-grid">
        <div class="privacy-page__toc">
          <p class="privacy-page__toc-title">On this page</p>
          <nav class="privacy-page__toc-nav" aria-label="Privacy policy sections">
            <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
              {{ section.label }}
            </a>
          </nav>
        </div>

        <div class="privacy-page__sections">
          <section id="introduction" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">01</span>
              <h2>Introduction</h2>
            </div>
            <p>Portaberto ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our event booking services.</p>
            <p>By using our services, you agree to the collection and use of information in accordance with this policy.</p>
          </section>

          <section id="information-we-collect" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">02</span>
              <h2>Information We Collect</h2>
            </div>
            <p>We may collect the following categories of personal information:</p>
            <ul>
              <li><strong>Contact information</strong> such as your name, email address, and phone number.</li>
              <li><strong>Event preferences</strong> including event types, venue preferences, dates, and times.</li>
              <li><strong>Account data</strong> such as profile details, booking history, and saved favourites.</li>
              <li><strong>Usage data</strong> covering pages visited, features used, and interactions with our platform.</li>
              <li><strong>Device data</strong> including browser type, IP address, and operating system.</li>
            </ul>
          </section>

          <section id="how-we-use-information" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">03</span>
              <h2>How We Use Your Information</h2>
            </div>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage event bookings and venue requests.</li>
              <li>Communicate with you about your bookings and enquiries.</li>
              <li>Personalise your experience and recommend relevant events.</li>
              <li>Improve our platform, services, and content.</li>
              <li>Send marketing communications where you have provided consent.</li>
              <li>Comply with legal obligations and resolve disputes.</li>
            </ul>
          </section>

          <section id="sharing-information" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">04</span>
              <h2>Sharing Your Information</h2>
            </div>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul>
              <li><strong>Venue partners</strong> when needed to fulfil your booking requests.</li>
              <li><strong>Service providers</strong> who help operate the platform, such as payment processors and email services.</li>
              <li><strong>Legal authorities</strong> when disclosure is required by law or needed to protect our legal rights.</li>
            </ul>
          </section>

          <section id="cookies-and-tracking" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">05</span>
              <h2>Cookies and Tracking</h2>
            </div>
            <p>We use cookies and similar tracking technologies to improve your experience. These may include:</p>
            <ul>
              <li><strong>Essential cookies</strong> needed for core platform functionality.</li>
              <li><strong>Analytics cookies</strong> that help us understand how visitors use the site.</li>
              <li><strong>Preference cookies</strong> that remember settings such as theme preferences.</li>
            </ul>
            <p>You can control cookie settings through your browser. Disabling certain cookies may affect the functionality of our services.</p>
          </section>

          <section id="data-retention" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">06</span>
              <h2>Data Retention</h2>
            </div>
            <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Account data is retained for the duration of your relationship with us, plus a reasonable period afterward for dispute resolution and compliance purposes.</p>
          </section>

          <section id="your-rights" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">07</span>
              <h2>Your Rights</h2>
            </div>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li>Request access to the personal data we hold about you.</li>
              <li>Request corrections to inaccurate or incomplete information.</li>
              <li>Request deletion of your personal data where applicable.</li>
              <li>Receive your data in a structured, machine-readable format.</li>
              <li>Object to certain uses of your data, including marketing communications.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:privacy@portaberto.com">privacy@portaberto.com</a>.</p>
          </section>

          <section id="data-security" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">08</span>
              <h2>Data Security</h2>
            </div>
            <p>We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.</p>
          </section>

          <section id="third-party-links" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">09</span>
              <h2>Third-Party Links</h2>
            </div>
            <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites, and we encourage you to review their policies before providing personal information.</p>
          </section>

          <section id="policy-changes" class="privacy-page__section">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">10</span>
              <h2>Changes to This Policy</h2>
            </div>
            <p>We may update this Privacy Policy from time to time. If we make significant changes, we will post a notice on the website or contact you directly where appropriate. Continued use of our services after changes take effect constitutes acceptance of the updated policy.</p>
          </section>

          <section id="contact-us" class="privacy-page__section privacy-page__section--highlight">
            <div class="privacy-page__section-head">
              <span class="privacy-page__section-index">11</span>
              <h2>Contact Us</h2>
            </div>
            <p>If you have questions or concerns about this Privacy Policy or our data practices, contact us using the details below.</p>
            <div class="privacy-page__contact-card">
              <p><strong>Email</strong><br><a href="mailto:privacy@portaberto.com">privacy@portaberto.com</a></p>
              <p><strong>Address</strong><br>Portaberto HQ, 14 Event Square, London, EC1A 1BB, United Kingdom</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const sections = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'information-we-collect', label: '2. Information We Collect' },
  { id: 'how-we-use-information', label: '3. How We Use Your Information' },
  { id: 'sharing-information', label: '4. Sharing Your Information' },
  { id: 'cookies-and-tracking', label: '5. Cookies and Tracking' },
  { id: 'data-retention', label: '6. Data Retention' },
  { id: 'your-rights', label: '7. Your Rights' },
  { id: 'data-security', label: '8. Data Security' },
  { id: 'third-party-links', label: '9. Third-Party Links' },
  { id: 'policy-changes', label: '10. Changes to This Policy' },
  { id: 'contact-us', label: '11. Contact Us' }
]
</script>

<style lang="scss" scoped>
@import './PrivacyPolicyPage.scss';
</style>
