const workoutRepository = require('../repositories/workoutRepository');
const exerciseRepository = require('../repositories/exerciseRepository');

class WorkoutService {
  async createWorkout(name, description) {
    if (!name) {
      throw new Error('Workout name is required');
    }
    return await workoutRepository.create(name, description);
  }

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

  async getAllWorkouts() {
    return await workoutRepository.findAll();
  }

  async getWorkoutById(id) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    return workout;
  }

  async updateWorkout(id, name, description) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    return await workoutRepository.update(id, name, description);
  }

  async deleteWorkout(id) {
    const workout = await workoutRepository.findById(id);
    if (!workout) {
      throw new Error('Workout not found');
    }
    await workoutRepository.delete(id);
  }
}

module.exports = new WorkoutService(); 