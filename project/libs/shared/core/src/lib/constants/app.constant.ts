export const MIN_PORT = 0
export const MAX_PORT = 65535

export const Environment = {
  DEV: 'development',
  PROD: 'production',
  STAGE: 'stage'
} as const;

export type EnvironmentType = typeof Environment[keyof typeof Environment];

export const ConfigEnvironment = {
  DB: 'database',

  // API-GATEWAY
  API_GATEWAY: 'api-gateway',

  // USER
  USER: 'user',
  USER_JWT: 'user-jwt',
  USER_MONGODB: 'user-mongodb',
  USER_RABBIT: 'user-rabbit',

  // POST
  POST: 'post',
  POST_RABBITMQ: 'post-rabbitmq',

  // NOTIFY
  NOTIFY: 'notify',
  NOTIFY_MONGODB: 'notify-mongodb',
  NOTIFY_RABBITMQ: 'notify-rabbitmq',
  NOTIFY_SMTP: 'notify-smtp',
} as const;
