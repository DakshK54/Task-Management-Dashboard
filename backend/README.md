# Backend API - PrimTrade Assignment

Express.js RESTful API with MongoDB, JWT authentication, and comprehensive task management.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Project Structure

- `models/` - Mongoose schemas (User, Task)
- `routes/` - API route handlers (auth, profile, tasks)
- `middleware/` - Authentication and other middleware
- `server.js` - Express app entry point