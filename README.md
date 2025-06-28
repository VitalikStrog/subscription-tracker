# Subscription Tracker API
A Node.js/Express API for managing user subscriptions with automated renewal reminders and administrative features.

### Common Issues

1. **MongoDB Connection Issues**
    - Ensure MongoDB is running
    - Check your `DB_URI` in environment variables

2. **JWT Token Errors**
    - Verify your `JWT_SECRET` is set
    - Check token expiration settings (`JWT_EXPIRES_IN`)

3. **Email Not Sending**
    - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
    - For Gmail, use an app-specific password instead of your regular password

4. **QStash/Workflow Issues**
    - Ensure `QSTASH_TOKEN` and signing keys are configured
    - Check if QStash URL is accessible (`QSTASH_URL`)

5. **Arcjet Security Issues**
    - Verify `ARCJET_KEY` is set correctly
    - Check `ARCJET_ENV` matches your environment (development/production)# Subscription Tracker API

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Project Structure](#project-structure)

## ✨ Features

- **User Authentication**: Sign up, sign in, and sign out functionality
- **Subscription Management**: Create, read, update, and cancel subscriptions
- **Role-based Access Control**: Admin and user roles with different permissions
- **Automated Reminders**: Workflow system for subscription renewal notifications
- **Upcoming Renewals**: Track subscriptions approaching renewal dates
- **Security**: Rate limiting and protection with Arcjet middleware
- **Email Notifications**: Automated email reminders using Nodemailer

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **Security**: Arcjet for rate limiting and protection
- **Email**: Nodemailer for email notifications
- **Message Queue**: Upstash QStash for workflow automation
- **Development**: tsx for TypeScript execution, ESLint + Prettier for code quality

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VitalikStrog/subscription-tracker.git
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   cp .env.example .env.prod
   ```

4. **Configure your environment variables** (see [Environment Variables](#environment-variables))

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create `.env.local` for development and `.env.prod` for production:

```env
# Environment
NODE_ENV=development

# Server Configuration
PORT=3000
SERVER_URL="http://localhost:3000"

# Database
DB_URI=mongodb://localhost:27017/subscription-tracker

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"

# Arcjet (Security & Rate Limiting)
ARCJET_KEY=your-arcjet-key
ARCJET_ENV=development

# Upstash QStash (Message Queue)
QSTASH_URL="http://127.0.0.1:8080"
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-current-signing-key
QSTASH_NEXT_SIGNING_KEY=your-next-signing-key

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🔗 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/sign-up` | Register a new user | No |
| POST | `/sign-in` | User login | No |
| POST | `/sign-out` | User logout | No |

### User Routes (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get all users | Yes | Admin |
| GET | `/:id` | Get user by ID | Yes | - |
| POST | `/` | Create user (admin) | Yes | Admin |
| PUT | `/:id` | Update user | Yes | - |
| DELETE | `/:id` | Delete user | Yes | - |

### Subscription Routes (`/api/v1/subscriptions`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get all subscriptions | Yes | Admin |
| GET | `/upcoming-renewals` | Get upcoming renewals | Yes | - |
| GET | `/:id` | Get subscription by ID | Yes | - |
| GET | `/user/:id` | Get user's subscriptions | Yes | - |
| POST | `/` | Create subscription | Yes | - |
| PUT | `/:id` | Update subscription | Yes | - |
| POST | `/:id/cancel` | Cancel subscription | Yes | - |
| DELETE | `/:id` | Delete subscription | Yes | Admin |

### Workflow Routes (`/api/v1/workflows`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/subscription/reminder` | Send subscription reminders | No* |

*Note: Workflow endpoints are typically called by automated systems

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in requests:

```javascript
Cookie: token=<your-jwt-token>
```

### Roles

- **User**: Can manage their own subscriptions and profile
- **Admin**: Can manage all users and subscriptions, access admin-only endpoints

## 📖 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### Create a subscription
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Netflix",
    "price": 9.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "startDate": "2025-05-29T00:00:00.000Z",
    "paymentMethod": "Credit card"
  }'
```

### Get upcoming renewals
```bash
curl -X GET http://localhost:3000/api/v1/subscriptions/upcoming-renewals \
  -H "Authorization: Bearer <your-token>"
```

## 🔧 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Development Workflow

1. Make changes to TypeScript files
2. The `tsx watch` will automatically restart the server
3. Test your changes using the API endpoints
4. Run linting and formatting before committing

## 📁 Project Structure

```
subscription-tracker/
├── config/                 # Configuration files
├── controllers/            # Route controllers
│   ├── auth.controller.ts
│   ├── subscription.controller.ts
│   ├── user.controller.ts
│   └── workflow.controller.ts
├── database/               # Database connection
│   └── mongodb.ts
├── middlewares/            # Express middlewares
│   ├── arcjet.middleware.ts
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── require-role.middleware.ts
├── models/                 # Database models
│   ├── role.model.ts
│   ├── subscription.model.ts
│   └── user.model.ts
├── routes/                 # Route definitions
│   ├── auth.routes.ts
│   ├── subscription.routes.ts
│   ├── user.routes.ts
│   └── workflow.routes.ts
├── services/               # Business logic services
│   ├── auth.service.ts
│   └── user.service.ts
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
│   ├── auth.ts
│   ├── constants.ts
│   ├── custom-error.ts
│   ├── email-template.ts
│   ├── send-email.ts
│   ├── user.ts
│   └── workflow.ts
├── app.ts                  # Main application file
├── package.json
└── tsconfig.json
```
