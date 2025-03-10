const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Create a new exercise
router.post('/', exerciseController.createExercise);

// Get all exercises
router.get('/', exerciseController.getAllExercises);

// Get a specific exercise
router.get('/:id', exerciseController.getExerciseById);

// Update an exercise
router.put('/:id', exerciseController.updateExercise);

// Delete an exercise
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router; 