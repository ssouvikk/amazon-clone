# Fastify Setup

## Overview
This document explains why we chose Fastify and how it is configured to work with NestJS.

## Implementation Details

### Bootstrap Logic
In `main.ts`, the application is initialized as a `NestFastifyApplication`:
```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: true }),
);
```

### High-Performance Features
- **Fastify Helmet**: Provides security headers (cross-site scripting, clickjacking, etc.).
- **Fastify Compression**: Compresses responses to reduce bandwidth and latency.
- **Logger Integration**: Uses Fastify's native logger for higher throughput.

## Design Decisions

### Performance Benefits
- **Benchmarks**: Fastify consistently outperforms Express in most microbenchmarks, making it ideal for high-traffic e-commerce backends.
- **Native Async Support**: Fastify was architected with native `async/await` support in mind.

### Global Prefix and API Versioning
- **Versioning**: By using a global prefix (e.g., `api/v1`), we prepare the app for seamless future transitions to new API versions.

## How It Works
1. Fastify's adapter transforms NestJS requests into Fastify calls.
2. Global middlewares are registered via Fastify plugins (e.g., `helmet`).
3. Routing is handled via the NestJS controller logic.

## How to Extend
To add new Fastify-specific plugins:
1. Install the `@fastify/` version of the plugin.
2. Register it in `main.ts` using `app.register()`.
3. Add a new design decision under "Design Decisions" if needed.
