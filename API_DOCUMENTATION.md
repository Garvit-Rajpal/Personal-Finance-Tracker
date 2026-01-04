# Personal Finance Tracker API

A RESTful API for managing personal finance transactions with income and expense tracking, built with Express.js, MongoDB, and Docker.

## Setup & Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Installation Steps (Docker - Recommended)

1. **Start the entire stack:**
   ```bash
   docker-compose up --build
   ```
   This will start the Node.js application and a MongoDB instance.

2. **Access the API:**
   The API will be available at `http://localhost:3000`

### Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Ensure you have a MongoDB instance running locally and update `.env`:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   ```

3. **Start the server:**
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode with auto-reload
   ```

The server will start on `http://localhost:3000`

## Health Check

Verify the server is running:
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-30T10:30:00.000Z"
}
```

## User Endpoints (Authentication & JWT)

> All protected endpoints require `Authorization: Bearer <token>`

### 1. POST /api/users — Register New User
**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "savingTarget": 0
  }
}
```

### 2. POST /api/users/login — Login
**Request:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>"
  }
}
```

### 3. PATCH /api/users/savings — Update Saving Target (auth)
**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -d '{ "savingTarget": 1500 }
```
**Success (200):** returns updated user fields.

### 4. GET /api/users/analytics — User Analytics (auth)
Returns income/expense summary, savings-target progress, and budget-vs-spend per category.

### 5. GET /api/users — List Users (admin/testing)
Unprotected list for dev/testing.

## API Endpoints (Transactions — auth required)

### 1. POST /api/transactions - Add Income/Expense

**Description:** Create a new transaction (income or expense)

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "Groceries",
    "amount": 150.50,
    "date": "2025-01-15"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | "income" or "expense" |
| category | string | Yes | Category name (non-empty) |
| amount | number | Yes | Positive number |
| date | string | Yes | ISO date format (YYYY-MM-DD) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "1234567890",
    "type": "expense",
    "category": "Groceries",
    "amount": 150.50,
    "date": "2025-01-15",
    "createdAt": "2025-01-30T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid amount format",
  "statusCode": 400
}
```

**Validation Rules:**
- `type` must be either "income" or "expense"
- `amount` must be a positive number
- `date` must be a valid ISO date
- `category` must be a non-empty string

  -H "Authorization: Bearer <jwt>"
```

### 2. GET /api/transactions - View All Transactions (auth)
Lists transactions for the authenticated user.

### 3. GET /api/transactions/:id - View Single Transaction (auth)

**Description:** Retrieve a specific transaction by ID

**Request:**
```bash
curl http://localhost:3000/api/transactions/1234567890
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "type": "expense",
    "category": "Groceries",
    "amount": 150.50,
    "date": "2025-01-15",
    "createdAt": "2025-01-30T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Transaction with id 1234567890 not found",
  "statusCode": 404
}
```

### 4. PATCH /api/transactions/:id - Update Transaction (auth)

**Description:** Update specific fields of a transaction

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/transactions/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 175.00,
    "category": "Vegetables"
  }'
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID |

**Request Body:** (All fields are optional)
| Field | Type | Description |
|-------|------|-------------|
| type | string | "income" or "expense" |
| category | string | Category name |
| amount | number | Transaction amount |
| date | string | ISO date format |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": "1234567890",
    "type": "expense",
    "category": "Vegetables",
    "amount": 175.00,
    "date": "2025-01-15",
    "createdAt": "2025-01-30T10:30:00.000Z",
    "updatedAt": "2025-01-30T11:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Transaction with id non-existent not found",
  "statusCode": 404
}
```

### 5. DELETE /api/transactions/:id - Delete Transaction (auth)

**Description:** Remove a transaction from the system

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/transactions/1234567890
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Transaction ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Transaction with id 1234567890 not found",
  "statusCode": 404
}
```

### 6. GET /api/transactions/summary - Income/Expense Summary (auth)
Returns totals and per-type breakdown for the authenticated user.

---

## Budget Endpoints (auth required)

### 1. GET /api/budgets — List budgets
Returns all budgets for the authenticated user.

### 2. POST /api/budgets — Create budget
Body:
```json
{
  "category": "Food",
  "amount": 300,
  "period": "monthly" // or "yearly"
}
```

### 3. PATCH /api/budgets/:id — Update budget
Update amount, category, or period for an existing budget.

## Project Architecture

### Folder Structure
```
src/
├── app.js                    # Express app setup
├── index.js                  # Server entry point
├── config/
│   └── index.js              # Configuration management
├── controllers/
│   └── transactionController.js    # Request handlers
├── models/
│   └── transactionModel.js         # Database operations (fs/promises)
├── services/
│   └── transactionService.js       # Business logic
├── routes/
│   └── transactionRoutes.js        # API routes
├── middleware/
│   ├── logger.js             # Request logging
│   ├── errorHandler.js       # Error handling
│   ├── validator.js          # Input validation
│   └── asyncHandler.js       # Async error wrapper
├── utils/
│   ├── errorClasses.js       # Custom error classes
│   ├── analytics.js          # Analytics utility
│   └── aiHelper.js           # AI helper utility
└── data/
    └── transactions.json     # Transaction database
```

### Key Concepts Implemented

#### 1. **Async/Await & Promise Handling**
- All database operations use `fs/promises` for non-blocking I/O
- Controllers use async/await for clean error handling
- Async handler middleware wraps route handlers

#### 2. **Error Handling**
- Global error middleware handles all errors uniformly
- Custom error classes: `AppError`, `ValidationError`, `NotFoundError`, `ConflictError`
- Consistent error response format with status codes

#### 3. **Middleware**
- **Logger:** Logs all incoming requests with timestamps
- **Error Handler:** Centralized error handling with proper HTTP status codes
- **Validator:** Validates transaction input data
- **Async Handler:** Wraps async route handlers to catch errors

#### 4. **Modular Architecture**
- **Routes:** Clean separation of route definitions
- **Controllers:** Handle HTTP request/response logic
- **Services:** Contains business logic and orchestration
- **Models:** Handles data persistence with fs/promises

#### 5. **Configuration Management**
- Environment variables via `.env`
- Centralized config module for easy access

#### 6. **Data Persistence**
- File-based storage using `fs/promises`
- JSON format for transaction data
- Automatic file creation if missing

---

## Testing

### Run Tests
```bash
npm test
```

### Test Files (unit, mocked services/DB)
- `tests/transactionRoutes.unit.test.js`
- `tests/budgetRoutes.unit.test.js`
- `tests/userRoutes.unit.test.js`
- `tests/endpoints.test.js` (manual guide/examples)

### Manual Testing Examples

**1. Create an expense transaction:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "Groceries",
    "amount": 150.50,
    "date": "2025-01-15"
  }'
```

**2. Create an income transaction:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "category": "Salary",
    "amount": 5000,
    "date": "2025-01-15"
  }'
```

**3. Get all transactions (auth required):**
```bash
curl http://localhost:3000/api/transactions \
  -H "Authorization: Bearer <jwt>"
```

**4. Get summary (auth required):**
```bash
curl http://localhost:3000/api/transactions/summary \
  -H "Authorization: Bearer <jwt>"
```

**5. Update a transaction (auth required):**
```bash
curl -X PATCH http://localhost:3000/api/transactions/1234567890 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -d '{"amount": 200}'
```

**6. Set a budget (auth required):**
```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -d '{"category":"Food","amount":300,"period":"monthly"}'
```

**7. Get analytics (auth required):**
```bash
curl http://localhost:3000/api/users/analytics \
  -H "Authorization: Bearer <jwt>"
```

---

## Error Handling Examples

### Validation Error (400)
```json
{
  "success": false,
  "error": "Missing required fields: type, category, amount, date",
  "statusCode": 400
}
```

### Invalid Type Error (400)
```json
{
  "success": false,
  "error": "Type must be either \"income\" or \"expense\"",
  "statusCode": 400
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Transaction with id non-existent not found",
  "statusCode": 404
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "statusCode": 500
}
```

---

## Features Implemented

✅ **Fundamentals & Setup**
- Express.js server setup
- MVC architecture
- /health route for server verification

✅ **REST API Development**
- POST /api/transactions - Create transactions
- GET /api/transactions - View all transactions
- GET /api/transactions/:id - View single transaction
- PATCH /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction
- GET /api/summary - Fetch summary (Global & Transaction-specific)

✅ **Async Programming & Middleware**
- Async/await for all I/O operations
- Global error-handling middleware
- Request logging middleware
- Input validation middleware

✅ **Advanced Node Concepts**
- Modular routes and controllers
- Reusable service layer for business logic
- Environment variables with dotenv
- Custom error classes
- fs/promises for file persistence
- Test cases for endpoints

---

## Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
TRANSACTIONS_DB_PATH=src/data/transactions.json
USERS_DB_PATH=src/data/users.json
```

---

## License

ISC
