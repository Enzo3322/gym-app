const express = require('express');
const router = express.Router();
const { shareLimiter } = require('../middleware/rateLimiters');
const shareController = require('../controllers/shareController');

// Share routes (with share rate limiting)
router.post('/workout/:id', shareLimiter, shareController.shareWorkout);
router.get('/:shareId', shareController.getSharedWorkout);

// Delete a share
router.delete('/:shareId', shareController.deleteShare);

module.exports = router; 