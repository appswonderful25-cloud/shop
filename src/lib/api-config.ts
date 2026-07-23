export const API_CONFIG = {
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  STRAPI_BASE_URL:
    process.env.NEXT_PUBLIC_STRAPI_URL?.replace('/api', '') ||
    'http://localhost:1337',
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1337',
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/local',
    REGISTER: '/api/auth/local/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    CREATE_SESSION: '/api/auth/create-session',
    PROTECTED_TEST: '/api/auth/protected-test',
    LOGOUT: '/api/auth/logout',
  },
  // Users
  USERS: {
    ME: '/api/users/me',
    BY_ID: (id: string) => `/api/users/${id}`,
    FILTERS: (filters: string) => `/api/users?${filters}`,
  },
  // Store Settings
  STORE_SETTINGS: {
    ME: '/api/store-setting/me',
  },
  // Products
  PRODUCTS: {
    LIST: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  // Orders
  ORDERS: {
    LIST: '/api/orders',
  },
  // Wallet
  WALLET: {
    LIST: '/api/wallets',
  },
  // Teams
  TEAMS: {
    LIST: '/api/teams',
    BY_ID: (id: string) => `/api/teams/${id}`,
    CREATE: '/api/teams',
  },
  // Returns
  RETURNS: {
    LIST: '/api/returns',
    BY_ID: (id: string) => `/api/returns/${id}`,
  },
  // Platform Support
  PLATFORM_SUPPORT: {
    LIST: '/api/platform-supports',
    BY_ID: (id: string) => `/api/platform-supports/${id}`,
  },
  // Support Tickets
  SUPPORT_TICKETS: {
    LIST: '/api/support-tickets',
    BY_ID: (id: string) => `/api/support-tickets/${id}`,
  },
  // Support Messages
  SUPPORT_MESSAGES: {
    LIST: '/api/support-messages',
    BY_ID: (id: string) => `/api/support-messages/${id}`,
  },
  // Coupons
  COUPONS: {
    LIST: '/api/coupons',
    BY_ID: (id: string) => `/api/coupons/${id}`,
    CREATE: '/api/coupons',
  },
  // Upload
  UPLOAD: '/api/upload',
  // User Messages
  USER_MESSAGES: {
    LIST: '/api/user-messages',
    BY_ID: (id: string) => `/api/user-messages/${id}`,
  },
  // Messages Conversation
  MESSAGES_CONVERSATION: {
    LIST: '/api/messages-conversations',
    BY_ID: (id: string) => `/api/messages-conversations/${id}`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    BY_ID: (id: string) => `/api/notifications/${id}`,
  },
  // OTP
  OTP: {
    FORGOT: '/api/custom-auth/custom-phone/otp-forgot',
    VALIDATE: '/api/custom-auth/custom-phone/otp-validate',
    RESET: '/api/custom-auth/custom-phone/otp-reset',
  },
} as const;

export function getStrapiUrl(endpoint: string): string {
  return `${API_CONFIG.STRAPI_BASE_URL}${endpoint}`;
}

export function getStrapiBaseUrl(endpoint: string): string {
  return `${API_CONFIG.STRAPI_BASE_URL}${endpoint}`;
}
