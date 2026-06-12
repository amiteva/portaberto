import { createI18n } from 'vue-i18n'

export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'mk', label: 'Македонски', shortLabel: 'MK' }
]

const STORAGE_KEY = 'eventus-locale'

const messages = {
  en: {
    a11y: {
      skipToContent: 'Skip to main content',
      mainNavigation: 'Main navigation',
      mobileNavigation: 'Mobile navigation',
      footerNavigation: 'Footer navigation',
      socialLinks: 'Social links',
      chooseLanguage: 'Choose language',
      toggleNavigation: 'Toggle navigation',
      signOut: 'Sign out'
    },
    nav: {
      events: 'Events',
      venues: 'Venues',
      contact: 'Contact',
      myBookings: 'My Bookings',
      favorites: 'Favorites',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      privacy: 'Privacy Policy'
    },
    footer: {
      motto: 'Where moments find their place.',
      location: 'Skopje, North Macedonia'
    },
    common: {
      tryAgain: 'Try Again',
      clearFilters: 'Clear Filters',
      loading: 'Loading'
    },
    home: {
      heroAria: 'Events hero',
      heroImageAlt: 'World-class events venue',
      eyebrow: 'Discover · Experience · Connect',
      titleLine1: 'Extraordinary',
      titleLine2: 'Events',
      lead: 'From global conferences to exclusive galas — find and book experiences that inspire.',
      browseEvents: 'Browse Events',
      bookVenue: 'Book a Venue',
      upcomingEvents: 'Upcoming Events',
      savedCount: '{count} saved · ',
      eventsTotal: '{count} events total'
    },
    login: {
      heroAlt: 'Portaberto event venue',
      tagline: 'Where moments find their place.',
      title: 'Welcome back',
      subtitle: "Choose how you'd like to continue",
      guestName: 'Continue as Guest',
      guestDescription: 'Browse events without an account',
      userDescription: 'Book events · Save favorites · Manage bookings',
      adminName: 'Admin',
      adminAlt: 'Admin',
      adminDescription: 'Edit venues · Manage all events · Full access'
    },
    favorites: {
      title: 'Favorites',
      subtitle: '{name}, these are the events you saved.',
      fallbackName: 'You',
      count: '{count} saved',
      loading: 'Loading your favorites…',
      emptyTitle: 'No favorites yet',
      emptyText: 'Save events with the heart button and they will appear here.'
    },
    filters: {
      label: 'Filter events',
      searchPlaceholder: 'Search events…',
      searchLabel: 'Search events',
      clearSearch: 'Clear search',
      categoryLabel: 'Filter by category',
      sortBy: 'Sort by',
      categories: {
        All: 'All',
        Conference: 'Conference',
        Workshop: 'Workshop',
        Gala: 'Gala',
        Exhibition: 'Exhibition',
        Summit: 'Summit',
        Symposium: 'Symposium'
      },
      sort: {
        dateAsc: 'Date — Soonest',
        dateDesc: 'Date — Latest',
        priceAsc: 'Price — Low to High',
        priceDesc: 'Price — High to Low',
        nameAsc: 'Name — A to Z'
      }
    },
    eventsGrid: {
      aria: 'Events listing',
      loading: 'Loading events…',
      empty: 'No events match your filters.',
      showing: 'Showing',
      event: 'event',
      events: 'events',
      pagination: 'Events pagination',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      page: 'Page {page}'
    },
    eventCard: {
      addFavorite: 'Add {title} to favorites',
      removeFavorite: 'Remove {title} from favorites',
      fromPrice: 'From €{price}',
      viewEvent: 'View Event',
      viewDetails: 'View details for {title}',
      openEvent: 'Open details for {title}'
    }
  },
  mk: {
    a11y: {
      skipToContent: 'Скокни до главната содржина',
      mainNavigation: 'Главна навигација',
      mobileNavigation: 'Мобилна навигација',
      footerNavigation: 'Навигација во подножје',
      socialLinks: 'Социјални мрежи',
      chooseLanguage: 'Избери јазик',
      toggleNavigation: 'Отвори или затвори навигација',
      signOut: 'Одјави се'
    },
    nav: {
      events: 'Настани',
      venues: 'Простори',
      contact: 'Контакт',
      myBookings: 'Мои резервации',
      favorites: 'Омилени',
      signIn: 'Најава',
      signOut: 'Одјава',
      privacy: 'Политика за приватност'
    },
    footer: {
      motto: 'Место каде моментите добиваат простор.',
      location: 'Скопје, Северна Македонија'
    },
    common: {
      tryAgain: 'Обиди се повторно',
      clearFilters: 'Исчисти филтри',
      loading: 'Се вчитува'
    },
    home: {
      heroAria: 'Главен приказ за настани',
      heroImageAlt: 'Простор за врвни настани',
      eyebrow: 'Откриј · Доживеј · Поврзи се',
      titleLine1: 'Посебни',
      titleLine2: 'Настани',
      lead: 'Од глобални конференции до ексклузивни гала настани — најди и резервирај искуства што инспирираат.',
      browseEvents: 'Разгледај настани',
      bookVenue: 'Резервирај простор',
      upcomingEvents: 'Претстојни настани',
      savedCount: '{count} зачувани · ',
      eventsTotal: 'Вкупно {count} настани'
    },
    login: {
      heroAlt: 'Portaberto простор за настани',
      tagline: 'Место каде моментите добиваат простор.',
      title: 'Добредојде назад',
      subtitle: 'Избери како сакаш да продолжиш',
      guestName: 'Продолжи како гостин',
      guestDescription: 'Разгледувај настани без профил',
      userDescription: 'Резервирај настани · Зачувај омилени · Управувај со резервации',
      adminName: 'Администратор',
      adminAlt: 'Администратор',
      adminDescription: 'Уредувај простори · Управувај со настани · Целосен пристап'
    },
    favorites: {
      title: 'Омилени',
      subtitle: '{name}, ова се настаните што ги зачува.',
      fallbackName: 'Ти',
      count: '{count} зачувани',
      loading: 'Се вчитуваат омилените…',
      emptyTitle: 'Сè уште нема омилени',
      emptyText: 'Зачувај настани со копчето срце и ќе се појават тука.'
    },
    filters: {
      label: 'Филтрирај настани',
      searchPlaceholder: 'Пребарај настани…',
      searchLabel: 'Пребарај настани',
      clearSearch: 'Исчисти пребарување',
      categoryLabel: 'Филтрирај по категорија',
      sortBy: 'Подреди по',
      categories: {
        All: 'Сите',
        Conference: 'Конференција',
        Workshop: 'Работилница',
        Gala: 'Гала',
        Exhibition: 'Изложба',
        Summit: 'Самит',
        Symposium: 'Симпозиум'
      },
      sort: {
        dateAsc: 'Датум — најскоро',
        dateDesc: 'Датум — најдоцна',
        priceAsc: 'Цена — ниска кон висока',
        priceDesc: 'Цена — висока кон ниска',
        nameAsc: 'Име — А до Ш'
      }
    },
    eventsGrid: {
      aria: 'Листа на настани',
      loading: 'Се вчитуваат настани…',
      empty: 'Нема настани што одговараат на филтрите.',
      showing: 'Прикажани',
      event: 'настан',
      events: 'настани',
      pagination: 'Пагинација на настани',
      previousPage: 'Претходна страница',
      nextPage: 'Следна страница',
      page: 'Страница {page}'
    },
    eventCard: {
      addFavorite: 'Додај {title} во омилени',
      removeFavorite: 'Отстрани {title} од омилени',
      fromPrice: 'Од €{price}',
      viewEvent: 'Види настан',
      viewDetails: 'Види детали за {title}',
      openEvent: 'Отвори детали за {title}'
    }
  }
}

function getInitialLocale() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED_LOCALES.some((locale) => locale.code === saved)) return saved
  }

  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('mk')) {
    return 'mk'
  }

  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.some((item) => item.code === locale)) return
  i18n.global.locale.value = locale
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale)
  if (typeof document !== 'undefined') document.documentElement.lang = locale
}

export function initLocale() {
  setLocale(i18n.global.locale.value)
}
