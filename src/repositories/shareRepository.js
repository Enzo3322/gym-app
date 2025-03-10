const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

class ShareRepository {
  async createShare(workoutId) {
    const id = uuidv4();
    const link = `${process.env.BASE_URL || 'http://localhost:3000'}/workouts/shared/${id}`;
    
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
        `SELECT sw.*, w.* 
         FROM shared_workouts sw
         JOIN workouts w ON sw.workout_id = w.id
         WHERE sw.id = ?`,
        [shareId],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
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