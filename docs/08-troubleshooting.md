# Troubleshooting: Swagger & Startup Issues

This document tracks common issues encountered during the application startup, specifically related to Swagger and Fastify integration.

## Swagger UI Crash

### Issue
The application crashes during the compilation or startup phase with a `TypeError` in `@nestjs/swagger`'s `SchemaObjectFactory.mergePropertyWithMetadata`.

### Root Cause
This is often caused by an improper DTO definition that `@nestjs/swagger` cannot introspect correctly. Common triggers include:
- Using `null` as a TypeScript type (e.g., `data!: null`).
- Circular dependencies between DTOs without using lazy loading (`() => Type`).
- Undefined types on properties decorated with `@ApiProperty`.

### Solution
Ensure all properties in DTOs used with `@ApiProperty` have valid TypeScript types or classes. If a field is intended to be null, use `any` or a specific object type and set `nullable: true` in the decorator.

```typescript
// Fix example
@ApiProperty({ example: null, nullable: true })
data?: any;
```

---

## Missing `@fastify/static` Dependency

### Issue
When running NestJS with Fastify and Swagger, the application fails with the error:
`ERROR [PackageLoader] The "@fastify/static" package is missing.`

### Root Cause
NestJS Swagger relies on `@fastify/static` to serve the Swagger UI assets when using the Fastify adapter.

### Solution
Install the missing dependency:
```bash
npm install @fastify/static
```
