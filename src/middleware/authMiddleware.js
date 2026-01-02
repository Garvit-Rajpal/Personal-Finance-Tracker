const { AppError } = require('../utils/errorClasses');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {

        if (!token.startsWith('mock-jwt-token-')) {
            throw new Error('Invalid token');
        }


        next();
    } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
    }
};

module.exports = { protect };
