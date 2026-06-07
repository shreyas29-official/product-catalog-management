# Order Approval Management System

A full-stack production-ready application for managing product catalogs, shopping carts, order approvals, and real-time notifications. Built with React 19 + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Features

### Admin
- Dashboard with analytics (products, orders, pending/approved/rejected counts)
- CRUD product management with image uploads
- Review and approve/reject purchase requests
- Real-time notifications for new orders

### Client
- Browse, search, filter, and sort products
- Shopping cart with quantity management
- Place orders (status: PENDING)
- Order history and status tracking
- Real-time notifications for order updates

### Security
- JWT authentication with role-based access control
- bcrypt password hashing
- Helmet, CORS, rate limiting
- Request validation with express-validator
- Protected API routes and frontend routes

### Real-time (Socket.IO)
- `order-created` — Admin notified when client places order
- `order-approved` — Client notified when order approved
- `order-rejected` — Client notified when order rejected
- `notification-received` — Instant notification delivery

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, React Router, Axios, Context API, Tailwind CSS, Socket.IO Client |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, Multer, Socket.IO |
| Security | Helmet, CORS, express-rate-limit, express-validator |

## Project Structure

```
├── backend/
│   ├── config/          # Database & Socket.IO config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, upload, validation, rate limiting
│   ├── models/          # Mongoose schemas (User, Product, Cart, Order, Notification)
│   ├── routes/          # REST API routes
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.IO event reference
│   ├── uploads/         # Product images
│   └── utilities/       # Helpers
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth, Cart, Socket providers
│       ├── pages/       # Admin & Client pages
│       └── services/    # API client layer
└── docs/                # API documentation & Postman collection
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 3. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

### First-time Setup
1. Register as **Admin** (only the first admin registration is allowed)
2. Register **Client** accounts separately
3. Admin creates products → Client browses and places orders → Admin approves/rejects

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiration (default: 7d) |
| `CLIENT_URL` | Frontend URL for CORS |
| `MAX_FILE_SIZE` | Max upload size in bytes |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | Socket.IO server URL |

## API Documentation

See [docs/API.md](docs/API.md) for full REST API reference.

## Postman Collection

Import [docs/Order-Approval-API.postman_collection.json](docs/Order-Approval-API.postman_collection.json) into Postman.

Set collection variables:
- `baseUrl`: `http://localhost:5000/api`
- `token`: JWT token (auto-set after login)

## License

MIT
