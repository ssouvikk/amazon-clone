# Dependency Injection Guide

This document explains the advanced Dependency Injection (DI) patterns implemented in this project and why they are used.

## 🚀 Core Principles

We follow **Dependency Inversion**, where high-level modules (Services) do not depend on low-level modules (Repositories), but both depend on abstractions (Interfaces).

### 1. Token-Based Injection
Instead of injecting concrete classes, we use unique strings/symbols as tokens. This allows us to swap implementations without changing the consumers.

**Example:**
```typescript
@Injectable()
export class ProductService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}
}
```

### 2. Injection Scopes

#### **Singleton (Default)**
- **Behavior**: One instance shared across the entire application.
- **Use Case**: `ProductService`, `UserService`.
- **Benefit**: Memory efficiency and state persistence (where applicable).

#### **Transient**
- **Behavior**: A new instance is created every time it is injected.
- **Use Case**: `LoggerService`.
- **Benefit**: Each service gets its own logger instance, which can have its own context.

#### **Request-Scoped**
- **Behavior**: A new instance is created for each incoming request.
- **Use Case**: `RequestContextService`.
- **Benefit**: Safely store request-specific data (Request ID, User ID) without leaking between requests.

### 3. Custom Providers

- **Class Providers**: Standard `@Injectable()` classes.
- **Value Providers**: Used for configuration objects or static values.
- **Factory Providers**: Used when a provider depends on other providers or requires async initialization (e.g., DB Connection simulation).
- **Existing Providers (Aliasing)**: Used to alias one token to another, helpful for legacy support.

## 🛠️ Implementation Details

### Shared Module
All global providers are registered in `SharedModule` and decorated with `@Global()`.

### Repository Swapping
Because we depend on `IRepository` interfaces, we can swap `MongoProductRepository` with `PostgresProductRepository` simply by changing the provider in `ProductModule`.

## ✅ Benefits
- **Testability**: Easy to mock interfaces in unit tests.
- **Decoupling**: Services don't know about the database implementation.
- **Maintainability**: Clear boundaries between infrastructure and business logic.
