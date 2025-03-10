const workoutService = require('../services/workoutService');

class WorkoutController {
  async createWorkout(req, res) {
    try {
      const { name, description } = req.body;
      const workout = await workoutService.createWorkout(name, description);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

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

  async getAllWorkouts(req, res) {
    try {
      const workouts = await workoutService.getAllWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWorkoutById(req, res) {
    try {
      const workout = await workoutService.getWorkoutById(req.params.id);
      res.json(workout);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateWorkout(req, res) {
    try {
      const { name, description } = req.body;
      const workout = await workoutService.updateWorkout(req.params.id, name, description);
      res.json(workout);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

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