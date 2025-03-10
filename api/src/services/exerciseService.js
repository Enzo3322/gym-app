const exerciseRepository = require('../repositories/exerciseRepository');

class ExerciseService {
  async createExercise(name, muscleGroup) {
    if (!name) {
      throw new Error('Exercise name is required');
    }

    const existingExercise = await exerciseRepository.findByName(name);

    if (existingExercise) {
      throw new Error('Exercise already exists');
    }

    return await exerciseRepository.create(name, muscleGroup);
  }

  async getAllExercises() {
    return await exerciseRepository.findAll();
  }

  async getExerciseById(id) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  }

  async updateExercise(id, name, muscleGroup) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    const existingExercise = await exerciseRepository.findByName(name);

    if (existingExercise && existingExercise.name === name) {
      throw new Error('Exercise already exists');
    }

    return await exerciseRepository.update(id, name, muscleGroup);
  }

  async deleteExercise(id) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    await exerciseRepository.delete(id);
  }
}

module.exports = new ExerciseService(); 