# Bank App – Full Stack Banking Platform

## 🚀 Live Demo

https://bigbankapp.duckdns.org

## 📌 Test Accounts

### 👤 Customer User1

- Email: `julik.golovenj@gmail.com`
- Password: `password123`

### 👤 Customer User2

- Email: `tomsimpson@test.com`
- Password: `tom123`

### 👤 Admin

- Email: `sam@admin.com`
- Password: `admin123`

### 👤 Super Admin

- Email: `jack@superadmin.com`
- Password: `admin123`

## 📸 Screenshots

### User Dashboard

![pic1](https://github.com/Julian22222/Bank/blob/main/screenshots/home.jpg)

### Accounts

![pic2](https://github.com/Julian22222/Bank/blob/main/screenshots/accounts.jpg)

### Messages

![pic3](https://github.com/Julian22222/Bank/blob/main/screenshots/messages.jpg)

### Admin - User dashboard

![pic4](https://github.com/Julian22222/Bank/blob/main/screenshots/admin-user-dashboard.jpg)

### Admin - Transactions

![pic5](https://github.com/Julian22222/Bank/blob/main/screenshots/admin-transactions.jpg)

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
- Role-based authorization (Admin & Super Admin)

## 👤 Customer Features

- View account dashboard
- Manage user details
- Create, edit, and delete bank accounts
- Transfer funds to and from user's account
- View account balances and transaction history
- Filter transaction statements
- Manage notifications and messages
- Print statements
- Responsive user interface

## 👨‍💼 Administrator Features

- Administrative dashboard
- View and manage users
- View all transactions
- Send notifications and messages to Bank users
- Register new users
- Role management
- Manage new Bank Accounts available for users

## 🧑‍💼 Super Administrator Features

- View and manage Admins
- Register new Admins
- Administrative dashboard
- View and manage users
- View all transactions
- Send notifications and messages to Bank users
- Register new users
- Role management
- Manage new Bank Accounts available for users

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

![pic6](https://github.com/Julian22222/Bank/blob/main/screenshots/aws_architecture.png)

# used AWS services:

- EC2
- RDS (PSQL)
- API Gateway
- Parameter Store
- Auto Scaling Groups (ASG)

# 📁 Project Structure

```text
Bank/
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
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── ecosystem.config.js
│   └── package.json
│
├── bankapp/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
|   |   └── styles/
│   │
│   ├── public/
│   ├── ecosystem.config.js
│   └── package.json
│
├── shared/
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
- Next.js
- NestJS
- PostgreSQL
- Bootstrap

## Clone the Repository

```bash
git clone https://github.com/Julian22222/Bank.git
```

# Backend Setup

Navigate into the project

```bash
cd bank-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

The application expects the following environment variables:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/bankdb
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
```

## Run development server

Start the B-End application with:

```bash
npm run start:dev
```

## Build production

```bash
npm run build

npm run start:prod
```

# Frontend Setup

Navigate into the project

```bash
cd bankapp
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

The application expects the following environment variables:

```env
BACK_END_URL=http://localhost:3005
```

## Run development server

Start the F-End application with:

```bash
npm run dev
```

## Build production

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

| Method | Endpoint        | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/auth`         | Check that the Auth User endpoint is working |
| POST   | `/auth/login`   | User login                                   |
| POST   | `/auth/logout`  | User logout                                  |
| POST   | `/auth/refresh` | Get new Access token for a User              |

## Users

| Method | Endpoint              | Description                                                                                   |
| ------ | --------------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/users/me`           | Retrieve a Login User                                                                         |
| GET    | `/users`              | Retrieve all Users                                                                            |
| GET    | `/users/:id`          | Retrieve a User by Id                                                                         |
| POST   | `/users`              | Create a new User + create Main account + create initial transaction + create welcome message |
| PATCH  | `/users/:id`          | Update a User by Id                                                                           |
| PATCH  | `/users/password`     | Update a Login User password                                                                  |
| PATCH  | `/users/:id/password` | Update a User password by Id                                                                  |
| DELETE | `/users/:id`          | Delete a User by Id                                                                           |

## Authentication - Admin

| Method | Endpoint              | Description                                   |
| ------ | --------------------- | --------------------------------------------- |
| GET    | `/auth-admin`         | Check that the Auth Admin endpoint is working |
| POST   | `/auth-admin/login`   | Admin login                                   |
| POST   | `/auth-admin/logout`  | Admin logout                                  |
| POST   | `/auth-admin/refresh` | Get new Access token for Admin                |

## Admin

| Method | Endpoint                                   | Description                                       |
| ------ | ------------------------------------------ | ------------------------------------------------- |
| GET    | `/admin/me`                                | Retrieve a Login Admin                            |
| GET    | `/admin`                                   | Retrieve all Admins                               |
| GET    | `/admin/user-registration`                 | Retrieve Users to register                        |
| GET    | `/admin/:id`                               | Retrieve an Admin by Id                           |
| POST   | `/admin`                                   | Create a new Admin                                |
| PATCH  | `/admin/:id`                               | Update an Admin by Id                             |
| PATCH  | `/admin/:id/password`                      | Update an Admin password by Id                    |
| DELETE | `/admin/user-registration/:registrationId` | Delete a user from registration by registrationId |
| DELETE | `/admin/:id`                               | Delete an Admin by id                             |

## Accounts

| Method | Endpoint                                  | Description                                            |
| ------ | ----------------------------------------- | ------------------------------------------------------ |
| GET    | `/accounts`                               | Retrieve all Accounts                                  |
| GET    | `/accounts/with-customers`                | Retrieve all Accounts with users data                  |
| GET    | `/accounts/saver-account/types`           | Retrieve all Saving Account types                      |
| GET    | `/accounts/user/:userId/accounts-balance` | Retrieve all User accounts with balance by userId      |
| GET    | `/accounts/my-accounts-balance`           | Retrieve all Login User Accounts with balance          |
| GET    | `/accounts/user/:accountId/with-balance`  | Retrieve a User Account data with balance by accountId |
| GET    | `/accounts/:accountId`                    | Retrieve an Account by accountId                       |
| POST   | `/accounts/saver-account/types`           | Create a new Saver Account type                        |
| POST   | `/accounts`                               | Create a new Account                                   |
| POST   | `/accounts/savings`                       | Create new saving account + crete new message          |
| PATCH  | `/accounts/:accountId`                    | Update an Account by accountId                         |
| DELETE | `/accounts/:accountId`                    | Delete an Account by accountId                         |

## Transactions

| Method | Endpoint                                         | Description                                                                   |
| ------ | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| GET    | `/transactions/my`                               | Retrieve all Login User Transactions                                          |
| GET    | `/transactions`                                  | Retrieve all Transactions                                                     |
| GET    | `/transactions/with-details`                     | Retrieve a Login User all Transactions with details                           |
| GET    | `/transactions/customer_id/accounts/:account_id` | Retrieve a User Transactions for certain user account by userId and accountId |
| GET    | `/transactions/user/:userId`                     | Retrieve all User Transactions from all accounts                              |
| GET    | `/transactions/:transactionId`                   | Retrieve a Transaction by Id                                                  |
| POST   | `/transactions`                                  | Create a new Transaction                                                      |

## Messages

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/messages/my`           | Retrieve all Login User Messages |
| GET    | `/messages`              | Retrieve all Messages            |
| GET    | `/messages/user/:userId` | Retrieve all Messages by userId  |
| GET    | `/messages/:messageId`   | Retrieve a Message by Id         |
| POST   | `/messages`              | Create a new Message             |
| PATCH  | `/messages/:messageId`   | Update a Message by messageId    |
| DELETE | `/messages/:messageId`   | Delete a Message by messageId    |

# 🧪 Testing

Testing includes

- Unit tests
- Integration tests
- API endpoint tests
- Validation testing

**50 automated tests covering controllers and API endpoints.**

Backend / Run the tests with:

```bash
npm test
```

End-to-End / Run the tests with:

```bash
npm run test:e2e
```

Frontend / Run the tests with:

```bash
npm run lint
```

# 🚀 Deployment

The application is production-ready and supports deployment using PM2.

```bash
pm2 start ecosystem.config.js
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
- File uploads in Chats
- Real-time messages with WebSockets
- messages microservice
- Database migrations using Prisma for messages microservice
- Add React Testing Library (RTL)

## License

MIT

## 👨‍💻 Author

**Julian Golovens**

- **GitHub:** [Julian22222](https://github.com/Julian22222)
- **LinkedIn:** [Julian Golovens](https://www.linkedin.com/in/julian-goloven-74a324256)
- **Portfolio:** [Portfolio](https://julian22222.github.io/Portfolio/)
