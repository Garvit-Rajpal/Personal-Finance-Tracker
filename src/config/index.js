require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/finance_tracker',
    TRANSACTIONS_DB_PATH: process.env.TRANSACTIONS_DB_PATH || 'src/data/transactions.json',
    USERS_DB_PATH: process.env.USERS_DB_PATH || 'src/data/users.json'
};
