# E-commerce API Documentation Guide

This document provides instructions on how to use and test the E-commerce API using Swagger UI.

## Swagger UI Access

The API documentation is available at:
`http://localhost:<PORT>/docs`

> [!NOTE]
> Swagger is disabled in the production environment for security reasons.

## How to use Swagger UI

1.  **Grouping**: APIs are grouped by module (Auth, Users, Products, Cart, Orders).
2.  **Testing**:
    *   Click on an endpoint to expand it.
    *   Click **Try it out** to enable input fields.
    *   Fill in the required parameters or request body.
    *   Click **Execute** to see the response.

## Authentication Flow

To test protected endpoints, you must provide a valid JWT token:

1.  **Get Token**: Use the `POST /auth/login` endpoint with valid credentials to obtain an `accessToken`.
2.  **Authorize**:
    *   Click the **Authorize** button at the top right of the Swagger UI.
    *   Enter your token in the format: `Bearer <your-token>`.
    *   Click **Authorize** and then **Close**.
3.  **Test**: Now you can call any protected endpoint (look for the padlock icon).

## Response Formats

### Success Response
All successful responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "...",
  "statusCode": 200,
  "timestamp": "..."
}
```

### Error Response
All error responses (400, 401, 403, 404, 500) follow this structure:
```json
{
  "success": false,
  "message": "...",
  "errorCode": "...",
  "timestamp": "...",
  "path": "..."
}
```

## Admin Access
Certain endpoints (e.g., creating products, viewing all users) require the `ADMIN` role. Ensure the user you are logged in as has the appropriate permissions.
