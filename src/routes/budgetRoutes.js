const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/',authMiddleware,asyncHandler(budgetController.getBudget));
router.post('/',authMiddleware,asyncHandler(budgetController.setBudget));
router.patch('/:id',authMiddleware,asyncHandler(budgetController.updateBudget));

module.exports = router;