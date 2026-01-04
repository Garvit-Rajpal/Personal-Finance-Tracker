const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');

// Register new user
router.post('/', asyncHandler(userController.register));

// Login (Mock JWT)
router.post('/login', asyncHandler(userController.login));

// Get all users (for testing/admin)
router.get('/', asyncHandler(userController.getAllUsers));

module.exports = router;
