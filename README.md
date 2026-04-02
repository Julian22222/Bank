# Bank App

## Overview

Bank App is a full-stack banking prototype with a NestJS REST API backend and a Next.js frontend. It supports user registration, admin control, account management, and transactional statements.

## Repository structure

- `/bank-api`: NestJS backend service (CRUD, PostgreSQL, JWT-style auth patterns, service modules for users/accounts/statements/admin).
- `/bankapp`: Next.js frontend (React 19, Tailwind/CSS, pages for login/registration/account/statement and customer dashboard).
- `/ecosystem.config.js`: PM2 process manager settings for production deployment.

## Tech stack

- TypeScript
- Node.js
- NestJS (backend)
- Next.js (frontend)
- PostgreSQL (database, via `pg` in backend)
- PM2
- ESLint + Prettier

## Architecture

### High-level architecture

1. Frontend (`bankapp`): Next.js app running in browser.
   - UI pages: login, registration, account overview, statements, admin dashboard.
   - Calls backend API endpoints for authentication and data operations.

2. Backend (`bank-api`): NestJS REST API.
   - Modules: `users`, `accounts`, `statements`, `admin`.
   - Controllers expose endpoints and delegate logic to services.
   - Services encapsulate business rules and repository interactions.
   - PostgreSQL holds core data; initialized using `myDatabase.sql`.

3. Data store: PostgreSQL.
   - `users`, `accounts`, `statements`, and admin-related tables.
   - Connection via `DATABASE_URL` and `pg` driver.

### Request flow

- User interacts with frontend page.
- Frontend sends HTTPS request to backend API (e.g., `/api/users`, `/api/accounts`).
- Backend controller receives request, validates payload, and calls service.
- Service uses repository/DB to execute SQL via `pg`.
- Response propagated back to frontend.

### Deployment architecture

- Dev: `npm run start:dev` in `bank-api`, `npm run dev` in `bankapp`.
- Prod: `npm run build` + `npm run start` in each module.
- Optional PM2 orchestrates backend using `ecosystem.config.js`.

## Backend: `bank-api`

### Features implemented

- Users module: create/read/update/delete users
- Accounts module: CRUD for bank accounts
- Statements module: transaction statements
- Admin module: admin user workflows
- CORS / configuration via `.env` + `dotenv`
- Jest unit + e2e tests

### Run backend

1. `cd bank-api`
2. `npm install`
3. create and configure `.env` (e.g. `DATABASE_URL`, `PORT=3000`)
4. `npm run start:dev` (development)
5. `npm run start:prod` after `npm run build`

### Backend scripts

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run lint`
- `npm test`
- `npm run test:e2e`

### Database

- `bank-api/myDatabase.sql` has base schema stubs.
- using `pg` driver for Postgres; adapt `src/app.module.ts` datasource configuration.

## Frontend: `bankapp`

### Features implemented

- Registration and Login UI
- Customer account page
- Statement listing by account type
- Banking highlights and quick actions
- Uses React 19 + Next 15 and TailwindCSS

### Run frontend

1. `cd bankapp`
2. `npm install`
3. `npm run dev` (app at `http://localhost:3000`)
4. `npm run build && npm run start` for production

### Frontend scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run json-server` (mock data API on port 3005)

## Root commands

- `npm run start2` (PM2 startup using `ecosystem.config.js`)

## Environment setup

Recommended `.env` values (backend):

- `DATABASE_URL=postgres://<user>:<pass>@localhost:5432/<db>`
- `PORT=3000`
- `JWT_SECRET=your-secret`

## Testing

- Backend:
  - `npm run test` (unit)
  - `npm run test:e2e`
- Frontend:
  - `npm run lint`

## Future improvements

- Add full JWT auth + role-based guards in NestJS
- Add production PostgreSQL migrations (TypeORM/Prisma)
- Add centralized API client and service layer for frontend
- Add Cypress/Puppeteer end-to-end tests
- Add CI configuration (GitHub Actions)

## Notes

- Ensure backend is running before using frontend interactions that hit API endpoints.
- `bankapp` currently contains a local `json-server` option for quick API mocks.

## License

MIT
