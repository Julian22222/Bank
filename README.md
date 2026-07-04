# Bank App – Full Stack Banking Platform

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

## 📸 Screenshots

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
- Layered backend architecture (controllers, services, repositories)
- Responsive frontend development
- Testing
- Production-ready deployment structure

# ✨ Features

## 🔐 Authentication

- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Protected API endpoints
- Role-based authorization (Customer & Admin)

## 👤 Customer Features

- View account dashboard
- Create, edit, and delete bank accounts
- View account balances
- View transaction history
- Filter transaction statements
- Responsive user interface

## 👨‍💼 Administrator Features

- View and manage users
- View all transactions
- Administrative dashboard
- Role management

## ⚙️ Backend Features

- RESTful API built with NestJS
- Modular architecture
- DTO validation
- Global validation pipes
- Centralized error handling
- PostgreSQL database integration
- Environment-based configuration

## 🎨 Frontend Features

- Next.js and React
- TypeScript
- Bootstrap UI
- Responsive design
- Client-side form validation
- REST API integration

## 🚀 DevOps & Deployment

- CI/CD pipeline with GitHub Actions
- PM2 process management
- Environment variable configuration

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
git clone https://github.com/Julian22222/Bank.git
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

JWT_REFRESH_SECRET=your-secret-key
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
npm run seed

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
GET /accounts/me

GET /accounts

GET /accounts/:id

GET /accounts/user/:accountId/balance

POST /accounts

PATCH /accounts/:id

DELETE /accounts/:id
```

## Transactions

```http
GET /transactions/my

GET /transactions

GET /transactions/:id

GET /transactions/user/:userId

POST /transactions

PATCH /transactions/:id

DELETE /transactions/:id
```

## Messages

```http
GET /messages/my

GET /messages

GET /messages/:id

GET /messages/user/:userId

POST /messages

PATCH /messages/:id

DELETE /messages/:id
```

## Administration

```http
GET /admin/me

GET /admin

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
- Redis caching for frequently accessed data
- Swagger/OpenAPI documentation
- Email and phone verification
- Password reset via email
- Two-factor authentication (2FA)
- Audit logging
- Rate limiting
- Account lockout after failed login attempts
- File uploads for user profile pictures
- Real-time notifications with WebSockets
- messages microservice
- Database migrations using Prisma or TypeORM

## License

MIT
