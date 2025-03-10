const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

/**
 * @typedef {Object} Share
 * @property {string} id - The unique identifier for the share.
 * @property {string} workoutId - The ID of the workout being shared.
 * @property {string} link - The URL link to the shared workout.
 * @property {string} qrCode - The QR code image data URL.
 */

/**
 * Repository for managing shared workouts in the database.
 * @class
 */
class ShareRepository {
  /**
   * Create a share for a workout.
   * @param {string} workoutId - The ID of the workout to share.
   * @returns {Promise<Object>} The created share object containing id, workoutId, link, and qrCode.
   */
  async createShare(workoutId) {
    const id = uuidv4();
    const link = `${process.env.BASE_URL || 'http://localhost:3000'}/api/workouts/shared/${id}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(link);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO shared_workouts (id, workout_id, link, qr_code) VALUES (?, ?, ?, ?)',
        [id, workoutId, link, qrCode],
        (err) => {
          if (err) reject(err);
          resolve({ id, workoutId, link, qrCode });
        }
      );
    });
  }

  /**
   * Find a shared workout by its share ID.
   * @param {string} shareId - The ID of the shared workout.
   * @returns {Promise<Object|null>} The shared workout object or null if not found.
   */
  async findByShareId(shareId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          sw.id as share_id,
          sw.link,
          sw.qr_code,
          w.id as workout_id,
          w.name as workout_name,
          w.description as workout_description
         FROM shared_workouts sw
         JOIN workouts w ON sw.workout_id = w.id
         WHERE sw.id = ?`,
        [shareId],
        async (err, workout) => {
          if (err) reject(err);
          if (!workout) {
            resolve(null);
            return;
          }

          // Get exercises for this workout
          const exercises = await new Promise((resolve, reject) => {
            db.all(
              `SELECT 
                e.id,
                e.name,
                e.muscle_group,
                we.reps,
                we.interval
               FROM exercises e
               JOIN workout_exercises we ON e.id = we.exercise_id
               WHERE we.workout_id = ?`,
              [workout.workout_id],
              (err, rows) => {
                if (err) reject(err);
                resolve(rows);
              }
            );
          });

          workout.exercises = exercises;
          resolve(workout);
        }
      );
    });
  }

  /**
   * Delete a share by its share ID.
   * @param {string} shareId - The ID of the share to delete.
   * @returns {Promise<void>}
   */
  async deleteShare(shareId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM shared_workouts WHERE id = ?', [shareId], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

module.exports = new ShareRepository(); 