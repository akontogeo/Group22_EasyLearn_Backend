# EasyLearn Backend

Lightweight Node.js + Express backend scaffold for the EasyLearn platform.

Features
- ES modules, async/await
- Mongoose models with fallback to in-memory mock data when MONGO_URI is not provided
- Basic authentication middleware
- Centralized error handler and consistent response format
- >10 routes across Users, Courses, Quizzes with GET/POST/PUT/DELETE

New quick start
1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env` and configure MONGO_URI (optional).
3. Start server:
   npm run dev

If no `MONGO_URI` is provided, the app uses built-in mock data for demonstration and testing.

Base URL
All API endpoints are exposed at the root (no `/api` prefix). Examples:

- GET /health
- GET /users
- GET /users/:userId
- GET /courses
- GET /courses/:courseId

Adjust your frontend or API client to call `/users` and `/courses` instead of `/api/users` or `/api/courses`.
