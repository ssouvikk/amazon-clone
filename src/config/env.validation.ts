import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGO_URI: Joi.string().required().description('MongoDB connection string'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  COOKIE_SECRET: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  // Cache & Redis
  CACHE_TTL: Joi.number().default(60000),
  CACHE_MAX: Joi.number().default(100),
  USE_REDIS: Joi.boolean().default(false),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
});
