const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} Exercise
 * @property {string} id - The unique identifier for the exercise.
 * @property {string} name - The name of the exercise.
 * @property {string} muscleGroup - The muscle group targeted by the exercise.
 */

/**
 * Repository for managing exercises in the database.
 * @class
 */
class ExerciseRepository {
  /**
   * Create a new exercise.
   * @param {string} name - The name of the exercise.
   * @param {string} muscleGroup - The muscle group the exercise targets.
   * @returns {Promise<Object>} The created exercise object.
   */
  async create(name, muscleGroup) {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO exercises (id, name, muscle_group) VALUES (?, ?, ?)',
        [id, name, muscleGroup],
        (err) => {
          if (err) reject(err);
          resolve({ id, name, muscleGroup });
        }
      );
    });
  }

  /**
   * Retrieve all exercises.
   * @returns {Promise<Array>} A list of all exercises.
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM exercises', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Find an exercise by its ID.
   * @param {string} id - The ID of the exercise.
   * @returns {Promise<Object|null>} The exercise object or null if not found.
   */
  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM exercises WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  /**
   * Update an existing exercise.
   * @param {string} id - The ID of the exercise to update.
   * @param {string} name - The new name of the exercise.
   * @param {string} muscleGroup - The new muscle group the exercise targets.
   * @returns {Promise<Object>} The updated exercise object.
   */
  async update(id, name, muscleGroup) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE exercises SET name = ?, muscle_group = ? WHERE id = ?',
        [name, muscleGroup, id],
        (err) => {
          if (err) reject(err);
          resolve({ id, name, muscleGroup });
        }
      );
    });
  }

  /**
   * Delete an exercise by its ID.
   * @param {string} id - The ID of the exercise to delete.
   * @returns {Promise<void>}
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM exercises WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Find an exercise by its name.
   * @param {string} name - The name of the exercise.
   * @returns {Promise<Object|null>} The exercise object or null if not found.
   */
  async findByName(name) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM exercises WHERE name = ?', [name], (err, row) => {
        resolve(row);
      });
    });
  }
}

module.exports = new ExerciseRepository(); 