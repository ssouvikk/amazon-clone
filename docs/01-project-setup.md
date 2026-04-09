# Project Setup

## Overview

This document outlines the initial setup of the Amazon Clone backend, built with NestJS and Fastify. The goal is to provide a production-grade, high-performance foundation for e-commerce features.

## Implementation Details

### Core Technologies
- **Framework**: NestJS (v11+)
- **HTTP Engine**: Fastify (Selected for its superior performance over Express)
- **Language**: TypeScript
- **Validation**: Joi (for Environment Variables) & Class-Validator (for DTOs)

### Initialization
The project was initialized using the Nest CLI and then migrated to use the Fastify adapter for improved throughput and lower latency.

```bash
# Start the development server
npm run start:dev

# Build for production
npm run build
```

## Design Decisions

### Why Fastify?
- **Performance**: Fastify is significantly faster than Express, capable of handling more requests per second with lower overhead.
- **Low Overhead**: Minimizes the resource footprint of the web server.

### Why Joi for Config?
- **Strictness**: Ensures that the application does not start if required environment variables are missing or invalid.
- **Type Safety**: Provides a clear interface for what environment variables are expected.

## How It Works
The application bootstraps in `main.ts`, where the NestFactory creates a `NestFastifyApplication`. Global pipes, filters, and interceptors are registered here to ensure consistent behavior across all routes.

## How to Extend
To add new global setup (like a new global pipe or middleware):
1. Create the pipe/middleware in `src/shared`.
2. Register it in `src/main.ts` using `app.useGlobal*`.
3. Document the change in this file under "Implementation Details".
