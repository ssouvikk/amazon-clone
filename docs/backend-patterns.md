# Backend Patterns

This document outlines the standardized backend patterns used in the project for validation, error handling, and response shaping.

## 1. DTO Validation

We use `class-validator` and `class-transformer` for strict input validation.

### Rules:
- All external inputs (Request Body, Query Params) must have a corresponding DTO.
- DTOs must use `class-validator` decorators.
- `ValidationPipe` is enabled globally with:
    - `whitelist: true`: Removes non-whitelisted properties.
    - `forbidNonWhitelisted: true`: Throws an error if non-whitelisted properties are present.
    - `transform: true`: Automatically transforms payloads to DTO instances.

### Example User DTO:
```typescript
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;
}
```

## 2. Advanced Custom Pipes

### ParseObjectIdPipe
Validates and transforms a string into a MongoDB `ObjectId`.
- **Usage**: `@Param('id', ParseObjectIdPipe) id: Types.ObjectId`

### TrimPipe
Sanitizes input by trimming leading/trailing whitespace from all string properties in an object.
- **Usage**: Registered globally or used at the controller level.

## 3. Global Exception Handling

All errors are caught by `GlobalExceptionFilter` and returned in a consistent format.

### Standard Error Response Format:
```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "timestamp": "2024-04-09T...",
  "path": "/api/v1/..."
}
```

### Error Mappings:
- **Validation Errors**: Maps `400 Bad Request` to `VALIDATION_ERROR`.
- **Duplicate Keys (Mongo)**: Maps code `11000` to `DUPLICATE_RESOURCE` (Status 409).
- **Not Found**: Maps `404 Not Found` to `NOT_FOUND`.
- **Auth Errors**: Maps `401` to `UNAUTHORIZED` and `403` to `FORBIDDEN`.

## 4. Interceptors

### TransformInterceptor
Standardizes successful API responses.

#### Success Response Format:
```json
{
  "success": true,
  "data": { ... }
}
```

### LoggingInterceptor
Logs every request with its method, URL, status code, and response time.
- **Log Format**: `[LoggingInterceptor] GET /api/v1/products 200 - 45ms`

## 5. Summary Table

| Feature | Implementation | Responsibility |
| :--- | :--- | :--- |
| Validation | `ValidationPipe` + DTOs | Input integrity & type safety |
| Sanitization | `TrimPipe` | Data cleaning |
| Error Handling | `GlobalExceptionFilter` | Consistent failure responses |
| Response Shaping | `TransformInterceptor` | Consistent success responses |
| Monitoring | `LoggingInterceptor` | Performance & request tracking |
