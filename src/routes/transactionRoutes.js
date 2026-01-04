const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validator');
const asyncHandler = require('../middleware/asyncHandler');


router.post('/', validateTransaction, asyncHandler(transactionController.createTransaction));

router.get('/', asyncHandler(transactionController.getAllTransactions));

router.get('/:id', asyncHandler(transactionController.getTransactionById));

router.patch('/:id', asyncHandler(transactionController.updateTransaction));

router.delete('/:id', asyncHandler(transactionController.deleteTransaction));

router.get('/summary', asyncHandler(transactionController.getSummary));

module.exports = router;
