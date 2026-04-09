# Database Design Documentation

This document outlines the MongoDB schema design, relationships, and indexing strategy for the Amazon Clone backend.

## Design Principles

- **Clean Architecture**: Database logic is encapsulated within the Repository layer.
- **DDD**: Schemas reflect domain entities while optimized for MongoDB's document model.
- **Soft Delete**: All core entities implement a soft delete pattern using `isDeleted` and `deletedAt`.

## Modules

### User
- **Schema**: Stores user credentials and profile information.
- **Fields**: `email`, `password`, `name`, `role`, `isDeleted`, `deletedAt`.
- **Indexes**: Unique index on `email`.
- **Soft Delete**: Implemented with `isDeleted` flag and `deletedAt` timestamp.
- **Security**: Password hashing implemented via Mongoose pre-save hook using `bcrypt`.

### Product
- **Schema**: Catalog information including price, stock, and images.
- **Fields**: `title`, `description`, `price`, `stock`, `category`, `images`, `isDeleted`, `deletedAt`.
- **Indexes**: 
  - Text index on `title` and `description` for full-text search.
  - Index on `category` for fast filtering.
- **Soft Delete**: Implemented with `isDeleted` flag and `deletedAt` timestamp.

### Cart
- **Schema**: User-specific shopping cart.
- **Design**: **Embedding** for cart items.
- **Rationale**: Carts are usually small and accessed frequently by the owner. Embedding reduces lookups.

### Order
- **Schema**: Transactional history of purchases.
- **Design**: **Hybrid (Snapshot)**.
- **Rationale**: Order items are embedded snapshots. References to `userId` and `productId` are maintained, but product details (price, title) are snapshotted to preserve historical state.

---

## Scalability Implications

- **Read-Heavy vs Write-Heavy**: Product queries are optimized via indexes. Cart updates are atomic document-level operations.
- **Sharding Strategy**: Future sharding can be performed on `userId` for Cart/Order and `productId` for Product catalogs.
