const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const shareController = require('../controllers/shareController');

// Create a new workout
router.post('/', workoutController.createWorkout);

// Add exercise to workout
router.post('/:workoutId/exercises', workoutController.addExerciseToWorkout);

// Get all workouts
router.get('/', workoutController.getAllWorkouts);

// Get a specific workout
router.get('/:id', workoutController.getWorkoutById);

// Update a workout
router.put('/:id', workoutController.updateWorkout);

// Delete a workout
router.delete('/:id', workoutController.deleteWorkout);

router.get('/shared/:shareId', shareController.getSharedWorkout);

module.exports = router; 