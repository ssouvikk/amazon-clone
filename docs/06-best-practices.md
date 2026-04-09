# Best Practices

## Overview
This document guides developers on writing clean, maintainable, and well-designed NestJS code for the Amazon Clone backend.

## Implementation Details

### Business Logic Placement
- **Logic in Services**: Controllers should only handle requests and response formatting. All business logic must live in Services.
- **Independence**: Services should be as independent as possible and not depend directly on database connection objects. Instead, use TypeORM (or Mongoose) models via Dependency Injection.

### Data Validation
- **All Inputs Must be Validated**: Every controller method that receives a body must use a DTO decorated with `class-validator` decorators.
- **Explicit Conversion**: Always enable `enableImplicitConversion` for global validation to ensure that types in DTOs (like `number`) match incoming strings.

### Exception Management
- **Use Standard Errors**: Prefer NestJS's standard exceptions (e.g., `NotFoundException`, `BadRequestException`).
- **Standardized Response**: Never return custom error objects; let the `GlobalExceptionFilter` transform standard errors into the standard `ApiResponse` format.

## Design Decisions

### Standardized API Responses
- **Consistency**: By forcing every response into an `ApiResponse<T>` wrapper, clients can always predict the shape of the incoming data, including success markers and timestamps.

### Clean Code Practices
- **SOLID**: All classes should adhere to Single Responsibility and Dependency Inversion principles.
- **DRY**: Use utility functions (living in `src/shared/utils`) or shared services to reduce code duplication.
- **Strict Type Safety**: Use of the `any` type is strictly forbidden. Always define interfaces or use appropriate utility types (like `Record<string, unknown>`) to ensure compile-time safety and better developer experience.

## How It Works
- **Request Cycle**: Every request goes through a standard cycle (Pipes -> Interceptors -> Controller -> Service -> Interceptor -> Filter).

## How to Extend
- If you find a new common pattern (like a recurring validation rule), create a custom decorator or pipe and add its usage here.
