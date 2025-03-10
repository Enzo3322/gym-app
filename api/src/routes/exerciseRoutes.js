const express = require('express');
const router = express.Router();
const { mutationLimiter } = require('../middleware/rateLimiters');
const exerciseController = require('../controllers/exerciseController');

// Create a new exercise
router.post('/', mutationLimiter, exerciseController.createExercise);

// Get all exercises
router.get('/', exerciseController.getAllExercises);

// Get a specific exercise
router.get('/:id', exerciseController.getExerciseById);

// Update an exercise
router.put('/:id', mutationLimiter, exerciseController.updateExercise);

// Delete an exercise
router.delete('/:id', mutationLimiter, exerciseController.deleteExercise);

module.exports = router; 