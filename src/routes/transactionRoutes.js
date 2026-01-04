const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validator');
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/',authMiddleware, validateTransaction, asyncHandler(transactionController.createTransaction));

router.get('/',authMiddleware, asyncHandler(transactionController.getAllTransactions));

router.get('/summary', authMiddleware, asyncHandler(transactionController.getSummary));

router.get('/:id', authMiddleware, asyncHandler(transactionController.getTransactionById));

router.patch('/:id', authMiddleware, asyncHandler(transactionController.updateTransaction));
router.delete('/:id',authMiddleware, asyncHandler(transactionController.deleteTransaction));

module.exports = router;
