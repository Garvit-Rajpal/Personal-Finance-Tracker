# 💰 Personal Finance Tracker API

A professional, production-ready RESTful API for managing personal finance transactions. This project provides a robust backend for tracking income and expenses, calculating financial summaries, and managing user sessions with mock JWT authentication.

---

## 🚀 Key Features

- **Auth-protected CRUD**: All transaction and budget routes are protected via JWT auth.
- **Budgets per category**: Set and update budgets (monthly/yearly) per user/category.
- **Financial summaries**: Per-user income/expense breakdown with net balance.
- **Analytics**: Savings-target progress and budget vs. spend by category.
- **User authentication**: Registration, login, and savings-target updates.
- **MongoDB + Mongoose** persistence, Dockerized runtime, centralized error handling, validation, and logging.

---

## 🏗️ Architecture

The project follows the **MVC (Model-View-Controller)** architectural pattern for a clean separation of concerns:

```
Routes → Controllers → Services → Models (MongoDB)
   ↓         ↓            ↓
(Endpoints) (Handlers)  (Logic)    (Persistence)
```

### Technology Stack
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **Containerization**: Docker & Docker Compose
- **Authentication**: Mock JWT (Base64 encoded)
- **Environment**: Dotenv for configuration

---

## 🐳 Getting Started with Docker

The easiest way to run the project is using Docker Compose, which orchestrates both the API server and the MongoDB database.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Installation & Setup

1. **Clone the repository** (if not already done).
2. **Start the services**:
   ```bash
   docker-compose up --build
   ```
   This command builds the application image and starts both the `app` and `mongodb` containers.

3. **Run in background** (optional):
   ```bash
   docker-compose up -d
   ```

4. **Stop the services**:
   ```bash
   docker-compose down
   ```

The API will be accessible at `http://localhost:3000`.

---

## 🛣️ API Endpoints (all JSON)

### Transactions (auth required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/transactions` | Create income/expense |
| `GET` | `/api/transactions` | List user’s transactions |
| `GET` | `/api/transactions/summary` | Per-user income/expense summary |
| `GET` | `/api/transactions/:id` | Fetch a single transaction by id |
| `PATCH` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

### Budgets (auth required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/budgets` | List budgets for the user |
| `POST` | `/api/budgets` | Create a budget (category, amount, period) |
| `PATCH` | `/api/budgets/:id` | Update a budget |

### Users & Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users` | Register user |
| `POST` | `/api/users/login` | Login and receive JWT |
| `GET` | `/api/users` | List users (testing/admin) |
| `PATCH` | `/api/users/savings` | Set/update savingTarget (auth) |
| `GET` | `/api/users/analytics` | Savings progress + budget-vs-spend (auth) |

---

## 🧪 How to Use the API

### 1. Health Check
Verify the server is running:
```bash
curl http://localhost:3000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login & Get Token
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
*Copy the `token` from the response.*

### 4. Create a Transaction (Protected)
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "income",
    "category": "Salary",
    "amount": 5000,
    "date": "2025-01-15"
  }'
```

### 5. Get Financial Summary (Protected)
```bash
curl http://localhost:3000/api/transactions/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Set a Budget (Protected)
```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "category": "Food",
    "amount": 300,
    "period": "monthly"
  }'
```

### 7. Get Analytics (Protected)
```bash
curl http://localhost:3000/api/users/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
src/
├── config/          # Configuration settings
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (Auth, Error, Logger, Validator)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── services/        # Business logic layer
└── utils/           # Helper classes and utilities
Dockerfile           # Docker image config
docker-compose.yml   # Service orchestration
.env                 # Environment variables
```

---

## 🔧 Environment Configuration

The application uses the following environment variables (configured in `.env`):

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/finance_tracker
JWT_SECRET=replace-me
SALT_ROUND=10
```

---

## ✅ Implementation Status
- [x] RESTful API Endpoints (transactions, budgets, analytics)
- [x] MongoDB Integration
- [x] Dockerization
- [x] JWT Authentication for protected routes
- [x] Global Error Handling
- [x] Input Validation
- [x] Request Logging
- [x] Unit tests for controllers with mocked services

