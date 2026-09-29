export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sopet_momentum?schema=public',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'sopet_dev_jwt_access_secret_2026_super_secure',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'sopet_dev_jwt_refresh_secret_2026_super_secure',
    accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
    refreshTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
    sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  redis: {
    url: process.env.REDIS_URL || '',
  },
  mail: {
    provider: process.env.MAIL_PROVIDER || 'console',
    from: process.env.MAIL_FROM || 'noreply@sopet-momentum.org',
  },
});
