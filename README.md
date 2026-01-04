# 💰 Personal Finance Tracker API

A professional, production-ready RESTful API for managing personal finance transactions. This project provides a robust backend for tracking income and expenses, calculating financial summaries, and managing user sessions with mock JWT authentication.

---

## 🚀 Key Features

- **Full CRUD for Transactions**: Create, read, update, and delete income/expense records.
- **Financial Summaries**: Real-time calculation of total income, total expenses, and net balance.
- **User Authentication**: Secure user registration and login with mock JWT-based session management.
- **Data Persistence**: High-performance data storage using MongoDB and Mongoose.
- **Containerized Environment**: Fully Dockerized setup for consistent development and deployment.
- **Robust Error Handling**: Centralized global error management with custom error classes.
- **Input Validation**: Strict validation for all incoming data to ensure data integrity.
- **Request Logging**: Detailed logging of all API requests with timestamps.

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

## 🛣️ API Endpoints

### Transaction Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/transactions` | Create a new transaction (income/expense) |
| `GET` | `/api/transactions` | Retrieve all transactions |
| `GET` | `/api/transactions/:id` | Get details of a specific transaction |
| `PATCH` | `/api/transactions/:id` | Update specific fields of a transaction |
| `DELETE` | `/api/transactions/:id` | Remove a transaction |
| `GET` | `/api/summary` | Get financial summary (Total Income, Expense, Balance) |

### User & Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user account |
| `POST` | `/api/users/login` | Authenticate user and receive a mock JWT token |
| `GET` | `/api/users` | List all registered users (for testing) |

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

### 5. Get Financial Summary
```bash
curl http://localhost:3000/api/summary
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
```

---

## ✅ Implementation Status
- [x] RESTful API Endpoints
- [x] MongoDB Integration
- [x] Dockerization
- [x] Mock JWT Authentication
- [x] Global Error Handling
- [x] Input Validation
- [x] Request Logging

