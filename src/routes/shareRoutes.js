const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// Share a workout
router.post('/workouts/:workoutId', shareController.shareWorkout);

// Get a shared workout
router.get('/:shareId', shareController.getSharedWorkout);

// Delete a share
router.delete('/:shareId', shareController.deleteShare);

module.exports = router; 