import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGO_URI: Joi.string().required().description('MongoDB connection string'),
  JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
});
