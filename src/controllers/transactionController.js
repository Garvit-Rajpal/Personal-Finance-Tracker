const transactionService = require('../services/transactionService');

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
