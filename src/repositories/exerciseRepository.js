const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

class ExerciseRepository {
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

  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM exercises', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM exercises WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

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

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM exercises WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

module.exports = new ExerciseRepository(); 