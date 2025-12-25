const transactions = require('../data/transactions.json');

const findAll = () => {
    return Promise.resolve(transactions);
};

module.exports = { findAll };
