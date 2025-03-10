const workoutRepository = require('../repositories/workoutRepository');
const exerciseRepository = require('../repositories/exerciseRepository');

/**
 * @typedef {Object} Workout
 * @property {string} id - The unique identifier for the workout.
 * @property {string} name - The name of the workout.
 * @property {string} description - A description of the workout.
 */

/**
 * @typedef {Object} FullWorkout
 * @property {string} id - The unique identifier for the workout.
 * @property {string} name - The name of the workout.
 * @property {string} description - A description of the workout.
 * @property {Exercise[]} exercises - An array of exercises associated with the workout.
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id - The unique identifier for the exercise.
 * @property {string} name - The name of the exercise.
 * @property {string} muscleGroup - The muscle group the exercise targets.
 */


/**
 * Service for managing workouts.
 * @class
 */
class WorkoutService {
  /**
   * Create a new workout.
   * @param {string} name - The name of the workout.
   * @param {string} description - The description of the workout.
   * @returns {Promise<Workout>} The created workout.
   * @throws {Error} If the workout name is required or already exists.
   */
  async createWorkout(name, description) {
    if (!name) {
      throw new Error('Workout name is required');
    }

    const existingWorkout = await workoutRepository.findByName(name);
    if (existingWorkout) {
      throw new Error('Workout already exists');
    }

    return await workoutRepository.create(name, description);
  }

  /**
   * Add an exercise to a workout.
   * @param {string} workoutId - The ID of the workout.
   * @param {string} exerciseId - The ID of the exercise.
   * @param {number} reps - The number of repetitions.
   * @param {number} interval - The interval for the exercise.
   * @returns {Promise<Workout>} The updated workout.
   * @throws {Error} If the workout or exercise is not found, or if the number of reps is invalid.
   */
  async addExerciseToWorkout(workoutId, exerciseId, reps, interval) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    const exercise = await exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    if (!reps || reps <= 0) {
      throw new Error('Invalid number of reps');
    }

    await workoutRepository.addExerciseToWorkout(workoutId, exerciseId, reps, interval);
    return await workoutRepository.findById(workoutId);
  }

  /**
   * Get all workouts.
   * @returns {Promise<Workout[]>} A list of all workouts.
   */
  async getAllWorkouts() {
    return await workoutRepository.findAll();
  }

  /**
   * Get a workout by ID.
   * @param {string} id - The ID of the workout.
   * @returns {Promise<FullWorkout>} The workout.
   * @throws {Error} If the workout is not found.
   */
  async getWorkoutById(id) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    return workout;
  }

  /**
   * Update a workout by ID.
   * @param {string} id - The ID of the workout.
   * @param {string} name - The new name of the workout.
   * @param {string} description - The new description of the workout.
   * @returns {Promise<Object>} The updated workout.
   * @throws {Error} If the workout is not found or already exists.
   */
  async updateWorkout(id, name, description) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }

    const existingWorkout = await workoutRepository.findByName(name);
    
    if (existingWorkout && existingWorkout.name === name) {
      throw new Error('Workout already exists');
    }

    return await workoutRepository.update(id, name, description);
  }

  /**
   * Delete a workout by ID.
   * @param {string} id - The ID of the workout.
   * @throws {Error} If the workout is not found.
   */
  async deleteWorkout(id) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    await workoutRepository.delete(id);
  }
}

module.exports = new WorkoutService(); 