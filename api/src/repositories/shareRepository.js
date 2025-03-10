const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

class ShareRepository {
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