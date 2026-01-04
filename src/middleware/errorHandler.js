const { AppError } = require('../utils/errorClasses');

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.name}: ${err.message}`);
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            statusCode: err.statusCode
        });
    }

    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        statusCode: 500
    });
};

module.exports = errorHandler;
