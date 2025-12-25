const transactionModel = require('../models/transactionModel');

exports.getAllTransactions = async () => {
    return await transactionModel.findAll();
};
