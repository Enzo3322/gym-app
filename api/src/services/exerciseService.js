const exerciseRepository = require('../repositories/exerciseRepository');



/**
 * @typedef {Object} Exercise
 * @property {string} id - The unique identifier for the exercise.
 * @property {string} name - The name of the exercise.
 * @property {string} muscleGroup - The muscle group the exercise targets.
 */

/**
 * Service for managing exercises.
 * @class
 */
class ExerciseService {
  /**
   * Create a new exercise.
   * @param {string} name - The name of the exercise.
   * @param {string} muscleGroup - The muscle group the exercise targets.
   * @returns {Promise<Exercise>} The created exercise.
   * @throws {Error} If the exercise name is required or already exists.
   */
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

  /**
   * Get all exercises.
   * @returns {Promise<Exercise[]>} A list of all exercises.
   */
  async getAllExercises() {
    return await exerciseRepository.findAll();
  }

  /**
   * Get an exercise by ID.
   * @param {string} id - The ID of the exercise.
   * @returns {Promise<Exercise>} The exercise.
   * @throws {Error} If the exercise is not found.
   */
  async getExerciseById(id) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  }

  /**
   * Update an exercise by ID.
   * @param {string} id - The ID of the exercise.
   * @param {string} name - The new name of the exercise.
   * @param {string} muscleGroup - The new muscle group the exercise targets.
   * @returns {Promise<Exercise>} The updated exercise.
   * @throws {Error} If the exercise is not found or already exists.
   */
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

  /**
   * Delete an exercise by ID.
   * @param {string} id - The ID of the exercise.
   * @throws {Error} If the exercise is not found.
   */
  async deleteExercise(id) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    await exerciseRepository.delete(id);
  }
}

module.exports = new ExerciseService(); 