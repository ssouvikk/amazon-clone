# Code Quality Workflow

This document describes the linting, formatting, and type-checking workflow for the project.

## Tooling

- **ESLint**: Enforces code quality and best practices.
- **Prettier**: Enforces consistent code formatting.
- **TypeScript (`tsc`)**: Performs static type checking.
- **Husky**: Manages Git hooks (pre-commit).
- **lint-staged**: Runs linting and formatting only on staged files during commit.

## NPM Scripts

- `npm run lint`: Runs ESLint to check for issues without fixing them.
- `npm run lint:fix`: Runs ESLint and automatically fixes all fixable issues.
- `npm run format`: Runs Prettier to format all TypeScript files in `src` and `test`.
- `npm run typecheck`: Runs TypeScript compiler in `noEmit` mode to verify types.
- `npm run check`: A unified script that runs `lint:fix`, `typecheck`, and `lint` again to ensure everything is perfect.

## Pre-commit Hook

On every commit, Husky runs `lint-staged`, which:
1. Runs `eslint --fix` on staged `.ts` files.
2. Runs `prettier --write` on staged `.ts` files.
3. Automatically stages any changes made by the fixers.

If any non-fixable errors remain, the commit will fail, ensuring that only high-quality code reaches the repository.

## Configuration Files

- `eslint.config.mjs`: ESLint flat configuration.
- `.prettierrc`: Prettier formatting rules.
- `tsconfig.json`: TypeScript compiler options.
- `.husky/pre-commit`: Husky hook definition.
