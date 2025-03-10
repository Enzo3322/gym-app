const db = require('../database/config');
const { v4: uuidv4 } = require('uuid');

class WorkoutRepository {
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

  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM workouts', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

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

  async findByName(name) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM workouts WHERE name = ?', [name], (err, row) => {
        resolve(row);
      });
    });
  }
}

module.exports = new WorkoutRepository(); 