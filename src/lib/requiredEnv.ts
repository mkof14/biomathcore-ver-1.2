/** Список обязательных переменных окружения. Расширяй по мере включения интеграций. */
export const REQUIRED_ENV = [
  // AI
  "GEMINI_API_KEY",
  // Payments
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  // Auth
  "NEXTAUTH_SECRET",
  // DB
  "DATABASE_URL",
  // Admin
  "ADMIN_DASH_PASSWORD",
  // Optional / подключай по надобности:
  // "NEXTAUTH_URL",
  // "EMAIL_SERVER_HOST","EMAIL_SERVER_PORT","EMAIL_SERVER_USER","EMAIL_SERVER_PASSWORD",
  // "GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET",
  // "APPLE_CLIENT_ID","APPLE_CLIENT_SECRET",
  // "MICROSOFT_CLIENT_ID","MICROSOFT_CLIENT_SECRET",
  // "FACEBOOK_CLIENT_ID","FACEBOOK_CLIENT_SECRET",
];
