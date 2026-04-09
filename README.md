# Amazon Clone Backend 🚀

Namaskar Souvik! Welcome to the **Amazon Clone Backend** repository. This is a production-grade, high-performance NestJS application built with Fastify, designed to provide a robust e-commerce platform.

## 📖 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture & Design](#architecture--design)

## 🌟 Project Overview
This repository contains the backend logic for an e-commerce platform, focusing on scalability, security, and performance. Features include modular architecture, strict environment validation, and standardized API response formats.

## 🛠 Tech Stack
- **Framework**: [NestJS](https://nestjs.com/) (v11+)
- **HTTP Engine**: [Fastify](https://www.fastify.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Validation**: [Joi](https://joi.dev/) & [Class-Validator](https://github.com/typestack/class-validator)
- **Security**: [Helmet](https://helmetjs.github.io/) & [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 📂 Project Structure
For a detailed breakdown, please see [03-folder-structure.md](docs/03-folder-structure.md).

```bash
src/
├── config/                  # Environment & app-specific configuration
├── modules/                 # Multi-module feature-based domain logic
├── shared/                  # Common filters, interceptors, and interfaces
└── database/                # Global database setup
docs/                         # Exhaustive project documentation
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Instance (Local or Atlas)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd amazon-clone-backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the required values.
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run start:dev
```

## 🔐 Environment Variables
The application uses strict validation via Joi. See [04-config.md](docs/04-config.md) for details.
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Application Port | No | `3000` |
| `MONGO_URI` | MongoDB Connection String | Yes | - |
| `JWT_SECRET` | Secret Key for JWT Signing | Yes | - |
| `NODE_ENV` | Environment Type | No | `development` |

## 📜 Available Scripts
- `npm run start:dev`: Starts the app in watch mode.
- `npm run build`: Compiles the project to `dist/`.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run test`: Runs unit tests.
- `npm run test:e2e`: Runs end-to-end tests.

## 📐 Architecture & Design
Check out our detailed documentation in the `/docs` folder:
- [01-project-setup.md](docs/01-project-setup.md): Initial setup and design rationale.
- [02-architecture.md](docs/02-architecture.md): Modular Monolith design pattern.
- [05-fastify-setup.md](docs/05-fastify-setup.md): Why and how we use Fastify.
- [06-best-practices.md](docs/06-best-practices.md): Coding guidelines and standards.

---

**BOSS! I'm ready for your next task!**
