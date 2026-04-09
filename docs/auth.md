# Authentication & Authorization

This document outlines the security architecture and implementation of the Authentication and Authorization system in the Amazon Clone backend.

## 🔐 Overview

The system uses a combination of **JWT (JSON Web Tokens)** for stateless authentication and **Refresh Tokens** for long-lived sessions and secure token rotation.

### Key Security Decisions:
- **Token Transport**: 
  - `Access Token`: Sent in the `Authorization: Bearer <token>` header (short-lived: 15m).
  - `Refresh Token`: Sent in an `HTTP-only` cookie (long-lived: 7d). This prevents XSS attacks from stealing the token.
- **Data Protection**: 
  - Passwords and Refresh Tokens are **never** stored in plain text.
  - Hashing is handled centrally via **Mongoose Hooks** in the `UserSchema`.
- **RBAC**: Role-Based Access Control is enforced via custom decorators and guards.

---

## 🔄 Authentication Flow

### 1. Registration (`POST /auth/register`)
- Input: `email`, `password`, `name`.
- Logic: `AuthService` calls `UserService`. `UserSchema` hashes password automatically before saving.
- Outcome: User created in MongoDB.

### 2. Login (`POST /auth/login`)
- Input: `email`, `password`.
- Logic: 
  - Validate credentials using `user.comparePassword()`.
  - Issue `AccessToken` (payload: `sub`, `email`, `role`).
  - Issue `RefreshToken`.
  - Store raw `RefreshToken` in `user.refreshToken`. **Mongoose hook** hashes it before persistence.
  - Set `refresh_token` as an HTTP-only cookie.
- Response: Access token in body + user metadata.

### 3. Refreshing Tokens (`POST /auth/refresh`)
- Input: `refresh_token` in cookie.
- Logic:
  - `JwtRefreshGuard` extracts token from cookie.
  - `JwtRefreshStrategy` validates JWT signature.
  - Strategy compares incoming token with hashed token in DB using `user.compareRefreshToken()`.
  - If valid, issues a new Access Token.
- Outcome: Extended session without re-login.

### 4. Logout (`POST /auth/logout`)
- Logic:
  - Clear `refreshToken` in MongoDB.
  - Clear the `refresh_token` cookie.
- Outcome: Secure session termination.

---

## 👤 Authorization (RBAC)

We use a combination of `@Roles` decorator and `RolesGuard`.

### Usage Example:
```typescript
@Post('admin-only')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
async adminAction() {
  return 'Success';
}
```

### Roles:
- `USER`: Default role for all new registrations.
- `ADMIN`: Special permissions for catalog management, etc.

---

## 🛡️ Security Implementation Details

### Mongoose Hooks (`src/modules/user/schemas/user.schema.ts`)
We use `pre-save` hooks to ensure hashing is always applied:
```typescript
UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('refreshToken') && this.refreshToken) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }
});
```

### Secure Transport
Cookies are configured with:
- `HTTP-only`: No JS access.
- `Secure`: HTTPS only (in production).
- `SameSite: strict`: CSRF protection.

---

## 🛠️ Configuration
Managed via `ConfigService` (`auth.config.ts`):
- `JWT_SECRET`: signing access tokens.
- `JWT_REFRESH_SECRET`: signing refresh tokens.
- `COOKIE_SECRET`: for signed cookies (optional layering).
- `BCRYPT_SALT_ROUNDS`: default is 10.
