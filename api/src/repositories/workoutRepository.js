const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} Workout
 * @property {string} id - The unique identifier for the workout.
 * @property {string} name - The name of the workout.
 * @property {string} description - A description of the workout.
 */

/**
 * Repository for managing workouts in the database.
 * @class
 */
class WorkoutRepository {
  /**
   * Create a new workout.
   * @param {string} name - The name of the workout.
   * @param {string} description - The description of the workout.
   * @returns {Promise<Object>} The created workout object.
   */
  async create(name, description) {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO workouts (id, name, description) VALUES (?, ?, ?)',
        [id, name, description],
        (err) => {
          if (err) reject(err);
          resolve({ id, name, description });
        }
      );
    });
  }

  /**
   * Add an exercise to a workout.
   * @param {string} workoutId - The ID of the workout.
   * @param {string} exerciseId - The ID of the exercise.
   * @param {number} reps - The number of repetitions for the exercise.
   * @param {number} interval - The interval for the exercise.
   * @returns {Promise<void>}
   */
  async addExerciseToWorkout(workoutId, exerciseId, reps, interval) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO workout_exercises (workout_id, exercise_id, reps, interval) VALUES (?, ?, ?, ?)',
        [workoutId, exerciseId, reps, interval],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  /**
   * Retrieve all workouts.
   * @returns {Promise<Array>} A list of all workouts.
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM workouts', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Find a workout by its ID.
   * @param {string} id - The ID of the workout.
   * @returns {Promise<Object|null>} The workout object or null if not found.
   */
  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM workouts WHERE id = ?', [id], async (err, workout) => {
        if (err) reject(err);
        if (!workout) {
          resolve(null);
          return;
        }

        // Get exercises for this workout
        const exercises = await new Promise((resolve, reject) => {
          db.all(
            `SELECT e.*, we.reps, we.interval
             FROM exercises e
             JOIN workout_exercises we ON e.id = we.exercise_id
             WHERE we.workout_id = ?`,
            [id],
            (err, rows) => {
              if (err) reject(err);
              resolve(rows);
            }
          );
        });

        workout.exercises = exercises;
        resolve(workout);
      });
    });
  }

  /**
   * Update an existing workout.
   * @param {string} id - The ID of the workout to update.
   * @param {string} name - The new name of the workout.
   * @param {string} description - The new description of the workout.
   * @returns {Promise<Object>} The updated workout object.
   */
  async update(id, name, description) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE workouts SET name = ?, description = ? WHERE id = ?',
        [name, description, id],
        (err) => {
          if (err) reject(err);
          resolve({ id, name, description });
        }
      );
    });
  }

  /**
   * Delete a workout by its ID.
   * @param {string} id - The ID of the workout to delete.
   * @returns {Promise<void>}
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run('DELETE FROM workout_exercises WHERE workout_id = ?', [id]);
        db.run('DELETE FROM shared_workouts WHERE workout_id = ?', [id]);
        db.run('DELETE FROM workouts WHERE id = ?', [id]);

        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Find a workout by its name.
   * @param {string} name - The name of the workout.
   * @returns {Promise<Object|null>} The workout object or null if not found.
   */
  async findByName(name) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM workouts WHERE name = ?', [name], (err, row) => {
        resolve(row);
      });
    });
  }
}

module.exports = new WorkoutRepository(); 