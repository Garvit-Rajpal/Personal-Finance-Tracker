const { ValidationError } = require('../utils/errorClasses');

const validateTransaction = (req, res, next) => {
    try {
        const { type, category, amount, date } = req.body;

        if (!type || !category || amount === undefined || !date) {
            throw new ValidationError('Missing required fields: type, category, amount, date');
        }

        if (!['income', 'expense'].includes(type)) {
            throw new ValidationError('Type must be either "income" or "expense"');
        }

        if (typeof amount !== 'number' || amount <= 0) {
            throw new ValidationError('Amount must be a positive number');
        }

        if (isNaN(new Date(date).getTime())) {
            throw new ValidationError('Invalid date format');
        }

        if (typeof category !== 'string' || category.trim() === '') {
            throw new ValidationError('Category must be a non-empty string');
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { validateTransaction };
