# Configuration Management

## Overview
This document describes the environment configuration setup, which uses `@nestjs/config` and `joi` for schema-based validation.

## Implementation Details

### Configuration Flow
The application uses a multi-layered approach to configuration:
1. Load environment variables from `.env`.
2. Validate them using the `Joi` schema in `src/config/env.validation.ts`.
3. Provide them through the `ConfigService`.

### Validation Schema
```typescript
{
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}
```

### Dependency-Injection-Friendly Objects
The `config/app.config.ts`, `config/auth.config.ts`, and `config/database.config.ts` files map raw environment variables into nested, type-safe objects.

## Design Decisions

### Why Joi Instead of Plain Env?
- **Failure Early**: If a critical secret (like `JWT_SECRET`) is missing, the app will fail to start, preventing runtime errors.
- **Defaulting**: Allows setting sane defaults for non-critical settings (like `PORT`).

### Why Domain-Specific Config Files?
- **Readability**: Easier to maintain smaller files like `auth.config.ts` than one massive object.

## How It Works
1. `AppModule` imports `ConfigModule.forRoot`.
2. `envValidationSchema` is passed as the `validationSchema`.
3. The mapped objects are registered as `load` functions.

## How to Extend
To add a new environment variable:
1. Define it in your `.env`.
2. Add the validation schema in `src/config/env.validation.ts`.
3. Map it to a configuration object in a relevant file under `src/config/`.
