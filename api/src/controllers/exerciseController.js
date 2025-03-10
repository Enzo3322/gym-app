const exerciseService = require('../services/exerciseService');

class ExerciseController {
  async createExercise(req, res) {
    try {
      const { name, muscleGroup } = req.body;
      const exercise = await exerciseService.createExercise(name, muscleGroup);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllExercises(req, res) {
    try {
      const exercises = await exerciseService.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExerciseById(req, res) {
    try {
      const exercise = await exerciseService.getExerciseById(req.params.id);
      res.json(exercise);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateExercise(req, res) {
    try {
      const { name, muscleGroup } = req.body;
      const exercise = await exerciseService.updateExercise(req.params.id, name, muscleGroup);
      res.json(exercise);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteExercise(req, res) {
    try {
      await exerciseService.deleteExercise(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ExerciseController(); 