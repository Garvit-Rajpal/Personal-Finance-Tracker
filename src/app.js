const express = require('express');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const transactionController = require('./controllers/transactionController');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const asyncHandler = require('./middleware/asyncHandler');

const app = express();

app.use(express.json());
app.use(logger);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.get('/api/summary', asyncHandler(transactionController.getSummary));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    });
});

app.use(errorHandler);

module.exports = app;
