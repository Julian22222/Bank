# Bank App – Full Stack Project Management App

## 🚀 Live Demo

https://your-app-url.com

## 📌 Test Accounts

### 👤 Customer User1

- Email: `julik.golovenj@gmail.com`
- Password: `password123`

### 👤 Customer User2

- Email: `tomsimpson@test.com`
- Password: `tom123`

### 👤 Admin User

- Email: `sam@admin.com`
- Password: `admin123`

# 📸 Screenshots

(put images here of different pages of your project)

### User Dashboard

![pic1](https://github.com/Julian22222/Bank/blob/main/screenshots/home.jpg)

### Accounts

![pic2](https://github.com/Julian22222/Bank/blob/main/screenshots/accounts.jpg)

### Messages

![pic2](https://github.com/Julian22222/Bank/blob/main/screenshots/messages.jpg)

### Admin - User dashboard

![pic2](https://github.com/Julian22222/Bank/blob/main/screenshots/admin-user-dashboard.jpg)

### Admin - Transactions

![pic2](https://github.com/Julian22222/Bank/blob/main/screenshots/admin-transactions.jpg)

# 📖 Overview

Bank App is a full-stack digital banking platform that allows customers to securely manage their bank accounts through a modern web application.

The system provides customer and administrator portals with role-based access, allowing users to manage accounts, view transaction history, and perform administrative tasks.

The application follows a typical enterprise architecture where a **Next.js frontend** communicates with a **NestJS REST API**, which stores and retrieves data from **PostgreSQL**.

The project was built to demonstrate full-stack software engineering practices including:

- REST API development
- Authentication & Authorization
- Database design
- CRUD operations
- Secure backend architecture
- Responsive frontend development
- Testing
- Production-ready deployment structure

# ✨ Features

## Authentication

- User registration
- User login
- JWT authentication
- Password hashing
- Protected API endpoints
- Role-based authorization
- Customer and Admin accounts

## Customer Features

- View dashboard
- Create bank accounts
- Edit account information
- Delete accounts
- View account balances
- View transaction history
- Filter statements
- Responsive user interface

## Administrator Features

- View all users
- Manage users
- View all transactions
- Administrative dashboard
- Role management

## Backend Features

- REST API
- Modular NestJS architecture
- DTO validation
- Global validation pipes
- Error handling
- PostgreSQL integration
- Environment configuration
- PM2 production support

## Frontend Features

- Next.js App
- TypeScript
- Bootstrap UI
- Responsive design
- Client-side validation
- API integration
- Authentication pages

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Bootstrap

## Backend

- NestJS
- Node.js
- TypeScript

## Database

- PostgreSQL

## Testing

- Jest
- Supertest

## Deployment

- PM2

# 🏗 Architecture

```text
                Next.js Frontend
                        │
                  HTTPS REST API
                        │
                 NestJS Backend
                        │
                  PostgreSQL Database
```

# 📁 Project Structure

```text
bank-app/
│
├── bank-api/
│   ├── src/
│   │   ├── accounts/
│   │   ├── admin/
│   │   ├── auth/
|   |   ├── auth-admin/
|   |   ├── database/
|   |   ├── messages/
│   │   ├── transactions/
│   │   ├── users/
│   │   └── main.ts
│   │
│   ├── test/
│   ├── myDatabase.sql
│   └── package.json
│
├── bankapp/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
|   |   └── styles/
│   │
│   ├── public/
│   └── package.json
│
├── ecosystem.config.js
└── package.json
```

# 🔄 Request Flow

```text
User

↓

Next.js Frontend

↓

REST API Request

↓

NestJS Controller

↓

Service Layer

↓

PostgreSQL Database

↓

JSON Response

↓

Frontend UI
```

# ⚙️ Installation

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Clone Repository

```bash
git clone https://github.com/yourusername/bank-app.git

cd bank-app
```

# Backend Setup

```bash
cd bank-api

npm install
```

Create a `.env` file.

Example:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/bankdb

PORT=3000

JWT_SECRET=your-secret-key
```

Run development server

```bash
npm run start:dev
```

Build production

```bash
npm run build

npm run start:prod
```

# Frontend Setup

```bash
cd bankapp

npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run development server

```bash
npm run dev
```

Production

```bash
npm run build

npm run start
```

# 📦 Backend Scripts

```bash
npm run start

npm run start:dev

npm run build

npm run lint

npm test

npm run test:e2e
```

# 📦 Frontend Scripts

```bash
npm run dev

npm run build

npm run start

npm run lint
```

# 🌐 REST API

## Authentication

```http
POST /auth/login

POST /auth/logout

POST /auth/register

POST /auth/refresh
```

## Users

```http
GET /users/me

GET /users

GET /users/:id

POST /users

PATCH /users/:id

PATCH /users/password

PATCH /users/:id/password

DELETE /users/:id
```

## Accounts

```http
GET /accounts

GET /accounts/me

GET /accounts/user/:accountId/balance

GET /accounts/:id

POST /accounts

PATCH /accounts/:id

DELETE /accounts/:id
```

## Transactions

```http
GET /transactions

GET /transactions/my

GET /transactions/user/:userId

GET /transactions/:id

POST /transactions

PATCH /transactions/:id

DELETE /transactions/:id
```

## Messages

```http
GET /messages

GET /messages/user/:userId

GET /messages/my

GET /messages/:id

POST /messages

PATCH /messages/:id

DELETE /messages/:id
```

## Administration

```http
GET /admin

GET /admin/me

GET /admin/:id

GET /admin/user-registration

POST /admin

PATCH /admin/:id

PATCH /admin/:id/password

GET /admin/transactions
```

# 🧪 Testing

Backend

```bash
npm test
```

End-to-End

```bash
npm run test:e2e
```

Frontend

```bash
npm run lint
```

Testing includes

- Unit tests
- Integration tests
- API endpoint tests
- Validation testing

# 🚀 Deployment

The application is production-ready and supports deployment using PM2.

Start using:

```bash
npm run start2
```

Deployment architecture:

```text
Browser

↓

Next.js Frontend

↓

NestJS API

↓

PostgreSQL
```

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Protected Routes
- DTO Validation
- Request Validation
- Environment Variables
- Secure REST API

# 🚀 Future Improvements

- Docker support
- GitHub Actions CI/CD
- Swagger API documentation
- Redis caching
- Email verification
- Password reset
- Two-factor authentication
- Audit logging
- Rate limiting
- Account lockout after failed login attempts
- File upload support
- Notification system
- Cypress
- messages microservice
- production PostgreSQL migrations (TypeORM/Prisma)

## License

MIT
