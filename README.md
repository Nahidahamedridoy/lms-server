# DataPollex Ltd. Simplified LMS — Backend API

A RESTful backend service for the DataPollex Ltd. Simplified Learning Management System (LMS) recruitment assessment. Built with Node.js, Express, TypeScript, and MongoDB.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Backend Technologies](#backend-technologies)
- [Project Structure](#project-structure)
- [Installation Instructions](#installation-instructions)
- [Environment Variables](#environment-variables)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Admin Seeding Instructions](#admin-seeding-instructions)
- [How to Run the Backend](#how-to-run-the-backend)
- [API Documentation](#api-documentation)
- [Admin Authentication & Security](#admin-authentication--security)

---

## Project Overview

The DataPollex Simplified LMS Backend powers course delivery, lecture cataloging, and administrative operations. It enforces secure JWT authentication on write/delete operations while exposing public read endpoints for students to browse courses and watch video lectures.

### Core Features
- **Public Course Catalog**: Retrieve published courses and their detailed information.
- **Lecture Delivery**: Hierarchical course lecture access with video streaming URLs.
- **Admin JWT Authentication**: Secure password hashing with bcrypt and JWT Bearer token generation.
- **Course & Lecture CRUD**: Protected endpoints for administrators to create, update, and delete courses and lectures.
- **Data Validation & Error Handling**: Comprehensive status codes, structured JSON responses, and centralized error handling.

---

## Backend Technologies

- **Runtime**: [Node.js](https://nodejs.org/) (v18+ recommended)
- **Framework**: [Express.js](https://expressjs.com/) v5
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Development Tooling**: `tsx` (TypeScript execute & watch), `cors`, `dotenv`

---

## Project Structure

```text
lms-server/
├── src/
│   ├── config/
│   │   └── db.ts                # MongoDB connection handler
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication request handlers
│   │   ├── course.controller.ts  # Course CRUD handlers
│   │   └── lecture.controller.ts # Lecture CRUD handlers
│   ├── middlewares/
│   │   └── auth.middleware.ts    # JWT Bearer verification middleware
│   ├── models/
│   │   ├── Admin.ts              # Admin user schema
│   │   ├── Course.ts             # Course schema (title, description, price, thumbnail)
│   │   └── Lecture.ts            # Lecture schema (title, description, videoUrl, course ref)
│   ├── routes/
│   │   ├── auth.routes.ts        # /api/auth routes
│   │   ├── course.routes.ts      # /api/courses routes
│   │   └── lecture.routes.ts     # /api/courses/:courseId/lectures & /api/lectures routes
│   ├── scripts/
│   │   └── seedAdmin.ts          # CLI script to seed the initial admin account
│   ├── services/
│   │   ├── auth.service.ts       # Authentication business logic & token signing
│   │   ├── course.service.ts     # Course query & mutation logic
│   │   └── lecture.service.ts    # Lecture query & mutation logic
│   ├── types/
│   │   └── express.d.ts          # Express request extension declarations
│   ├── app.ts                    # Express application configuration & route binding
│   └── server.ts                 # Server entrypoint and port listener
├── .env.example                  # Environment configuration template
├── package.json
└── tsconfig.json
```

---

## Installation Instructions

### Prerequisites
- Node.js (version 18.0 or higher)
- npm (Node Package Manager)
- A running MongoDB instance (MongoDB Atlas cluster or local MongoDB instance)

### 1. Clone or Open the Repository
```bash
cd c:/projects/lms-server
```

### 2. Install Dependencies
```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root of `lms-server` by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables as follows (use your own placeholder values):

```env
# Server Port & Allowed Client Origin
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB Connection String (Atlas URI or Local URI)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority

# JWT Signing Secret (Generate a strong, random string)
JWT_SECRET=your_jwt_secret_key_here

# Initial Admin User Credentials (Used by seed script)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

> **Security Note:** Never commit `.env` or production secrets to source control. The `.gitignore` file excludes `.env`.

---

## MongoDB Atlas Setup

1. **Create an Atlas Account**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an organization/project.
2. **Deploy a Free Cluster**: Choose the shared M0 free tier.
3. **Configure Database Access**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Create a user with **Read and write to any database** privileges.
4. **Configure Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address** and add your current IP address (or `0.0.0.0/0` for recruitment testing/evaluation environments).
5. **Get Connection String**:
   - Click **Connect > Drivers > Node.js**.
   - Copy the URI and replace `<username>`, `<password>`, and `<database_name>` in your `.env` file.

---

## Admin Seeding Instructions

The backend includes a dedicated seeding script (`src/scripts/seedAdmin.ts`) that hashes the admin password with `bcryptjs` and inserts the initial administrator account into MongoDB if it does not already exist.

Run the seed script:

```bash
npm run seed:admin
# or
npm run seed
```

**Console Output:**
```text
MongoDB Connected: <cluster-host>
Admin seeded successfully: { id: '...', username: 'admin', email: 'admin@example.com' }
Database connection closed.
```

---

## How to Run the Backend

### Development Mode (with hot reloading)
```bash
npm run dev
```
The server will start on `http://localhost:5000` using `tsx watch`.

### Production Build & Execution
```bash
# 1. Compile TypeScript to JavaScript
npm run build

# 2. Start compiled production server
npm start
```

### Verify Server Status
Open `http://localhost:5000/api/health` or `http://localhost:5000/` in your browser. Expected response:
```json
{
  "success": true,
  "message": "LMS Backend API is running!"
}
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root health check |
| `GET` | `/api/health` | Public | API health check |

---

### 2. Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin and returns JWT Bearer token |

#### `POST /api/auth/login` Request Body:
```json
{
  "email": "admin@example.com",
  "password": "your_secure_admin_password"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "6735a1b...",
    "username": "admin",
    "email": "admin@example.com",
    "createdAt": "2026-11-14T...",
    "updatedAt": "2026-11-14T..."
  }
}
```

---

### 3. Courses
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | List all courses (sorted by creation date) |
| `GET` | `/api/courses/:id` | Public | Get single course by MongoDB ID |
| `POST` | `/api/courses` | **Admin Only** | Create a new course |
| `PUT` | `/api/courses/:id` | **Admin Only** | Update an existing course |
| `DELETE` | `/api/courses/:id` | **Admin Only** | Delete a course |

#### `POST /api/courses` Request Body:
```json
{
  "title": "Full-Stack Node.js and React",
  "description": "Comprehensive full-stack engineering curriculum.",
  "price": 49.99,
  "thumbnail": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
}
```

---

### 4. Lectures
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses/:courseId/lectures` | Public | List all lectures for a specific course |
| `GET` | `/api/lectures/:id` | Public | Get a single lecture by ID |
| `POST` | `/api/courses/:courseId/lectures` | **Admin Only** | Create a lecture attached to a course |
| `PUT` | `/api/lectures/:id` | **Admin Only** | Update an existing lecture |
| `DELETE` | `/api/lectures/:id` | **Admin Only** | Delete a lecture |

#### `POST /api/courses/:courseId/lectures` Request Body:
```json
{
  "title": "1. Introduction to Express Architecture",
  "description": "Overview of middlewares, routes, and controllers.",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

---

## Admin Authentication & Security

1. **JWT Header Format**:
   All protected endpoints require the `Authorization` HTTP header:
   ```text
   Authorization: Bearer <your_jwt_token_here>
   ```

2. **Middleware Verification (`src/middlewares/auth.middleware.ts`)**:
   - Inspects the incoming Bearer token against `process.env.JWT_SECRET`.
   - Returns `401 Unauthorized` with structured JSON if the token is missing, expired, or malformed:
     ```json
     {
       "success": false,
       "message": "Access denied. No token provided."
     }
     ```
   - On successful verification, appends `req.admin` payload for downstream controller access.
