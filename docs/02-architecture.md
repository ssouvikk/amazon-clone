# Architecture

## Overview
The Amazon Clone backend follows a **Modular Monolith** architecture. This ensures high cohesion within modules and low coupling between them, making the codebase easier to maintain and scale.

## Implementation Details

### Core Principles
- **Modularity**: Code is split into domain-specific modules (e.g., Auth, Cart, Products).
- **Separation of Concerns**: Controllers handle requests, Services handle business logic, and Repositories (or Models) handle data persistence.
- **Independence**: Each module should be as self-contained as possible.

### Folder Structure
Each module lives in `src/modules` and usually contains:
- `*.module.ts`
- `*.controller.ts`
- `*.service.ts`
- `dto/*.dto.ts`
- `schemas/*.schema.ts` (for MongoDB)
- `interfaces/*.interface.ts`

## Design Decisions

### Why Modular Monolith?
- **Cognitive Load**: Easier for new developers to understand one domain at a time.
- **Transition to Microservices**: If ever needed, individual modules can be extracted into their own services with minimal effort.
- **Atomic Operations**: Database transactions are easier to manage than in a distributed microservices environment.

## How It Works
1. A client sends a request.
2. The `MainApp` receives it via Fastify.
3. Global Interceptors (like `LoggingInterceptor`) process the request.
4. The router directs the request to the appropriate `Controller`.
5. The `Controller` validates the request using a `Pipe`.
6. The `Controller` calls the `Service`.
7. The `Service` executes domain logic and interacts with the database.
8. The result is returned and wrapped by the `TransformInterceptor`.

## How to Extend
To add a new feature:
1. Create a new module using `nest generate module modules/<feature-name>`.
2. Implement your domain logic.
3. Keep cross-module interactions minimal (use events or dedicated services).
