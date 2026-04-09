# Folder Structure

## Overview
This document explains the organization of the codebase, which follows a clean, modular structure inspired by Domain-Driven Design (DDD) principles.

## Implementation Details

```bash
src/
├── app.module.ts            # Root application module
├── main.ts                  # Application entry point
├── config/                  # Environment and application configuration
│   ├── app.config.ts        # App-specific config mappings
│   ├── auth.config.ts       # Authentication-specific config mapping
│   ├── database.config.ts   # Database configuration mapping
│   └── env.validation.ts    # Joi schema for environment variable validation
├── database/                # Global database setup (MongoDB)
├── modules/                 # Feature-based domain modules
│   ├── auth/                # Sign-in/up logic
│   ├── products/            # Catalog management
│   ├── orders/              # Checkout and history
│   └── cart/                # User's shopping cart
└── shared/                  # Common code, types, and logic
    ├── filters/             # Global exception filters
    ├── interceptors/        # Global interceptors (Logging/Transform)
    ├── interfaces/          # Shared TypeScript interfaces
    └── pipes/               # Common validation or transformation pipes
docs/                         # Project documentation
test/                         # E2E and integration tests
```

## Design Decisions

### Feature-Based Organization
- **Locality**: Code that changes together is grouped together (e.g., product DTOs, services, and controllers).
- **Ease of Search**: Finding a feature is straightforward—just look in the `modules` folder.

### Shared Layer
- **Commonality**: Prevents code duplication for things used throughout the app (like the `ApiResponse` interface).

## How It Works
1. `main.ts` bootstraps the `AppModule`.
2. `AppModule` imports and aggregates all domain modules from `src/modules`.
3. `config` folder manages environment injection.
4. `shared` provides cross-cutting concerns (Global Filters, Interceptors).

## How to Extend
To add a new folder or level of abstraction:
1. Ensure the layer is truly cross-cutting (lives in `shared`) or domain-specific (lives in `src/modules/<feature-name>`).
2. Update this structure map in `docs/03-folder-structure.md`.
