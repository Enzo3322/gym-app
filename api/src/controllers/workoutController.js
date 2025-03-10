const workoutService = require('../services/workoutService');

/**
 * Controller for managing workouts.
 * @class
 */
class WorkoutController {
  /**
   * Create a new workout.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async createWorkout(req, res) {
    try {
      const { name, description } = req.body;
      const workout = await workoutService.createWorkout(name, description);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Add an exercise to a workout.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async addExerciseToWorkout(req, res) {
    try {
      const { workoutId } = req.params;
      const { exerciseId, reps, interval } = req.body;
      const workout = await workoutService.addExerciseToWorkout(workoutId, exerciseId, reps, interval);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all workouts.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async getAllWorkouts(req, res) {
    try {
      const workouts = await workoutService.getAllWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a workout by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async getWorkoutById(req, res) {
    try {
      const workout = await workoutService.getWorkoutById(req.params.id);
      res.json(workout);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Update a workout by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async updateWorkout(req, res) {
    try {
      const { name, description } = req.body;
      const workout = await workoutService.updateWorkout(req.params.id, name, description);
      res.json(workout);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Delete a workout by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async deleteWorkout(req, res) {
    try {
      await workoutService.deleteWorkout(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new WorkoutController(); 