export const APP_ROUTES = {
  APP: {
    HOME: '/',
    HOME_ALIAS: '/dashboard',
    ABOUT: '/about',
    SERVICES: '/services',
    CONTACT: '/contact',
    FAQ: '/faq',
    GET_STARTED: '/get-started',
    PARTICIPANT: {
      DASHBOARD: '/participant/dashboard',
      REQUEST_SHIFT: '/participant/shifts/request',
      UPCOMING_SHIFTS: '/participant/shifts/upcoming',
      PREVIOUS_SHIFTS: '/participant/shifts/previous',
      SUPPORT_NOTES: '/participant/support-notes',
    },
    TRAINER: {
      DASHBOARD: '/trainer/dashboard',
      AVAILABILITY: '/trainer/availability',
      BOOKINGS: '/trainer/bookings',
      SHIFT_HISTORY: '/trainer/shifts/history',
      CLIENT_NOTES: '/trainer/client-notes',
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      PARTICIPANTS: '/admin/participants',
      TRAINERS: '/admin/trainers',
      SHIFTS: '/admin/shifts',
      TIMESHEETS: '/admin/timesheets',
    },
  },
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    FORGOT_PASSWORD: '/auth/forgot-password',
    REGISTER_PARTICIPANT: '/auth/register-participant',
    REGISTER_TRAINER: '/auth/register-trainer',
  },
  NOT_FOUND: '*',
} as const;
