const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Create exercises table
    db.run(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        muscle_group TEXT
      )
    `);

    // Create workouts table
    db.run(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `);

    // Create workout_exercises table (junction table)
    db.run(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        workout_id TEXT,
        exercise_id TEXT,
        reps INTEGER,
        interval INTEGER,
        FOREIGN KEY (workout_id) REFERENCES workouts(id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id),
        PRIMARY KEY (workout_id, exercise_id)
      )
    `);

    // Create shared_workouts table
    db.run(`
      CREATE TABLE IF NOT EXISTS shared_workouts (
        id TEXT PRIMARY KEY,
        workout_id TEXT,
        link TEXT NOT NULL,
        qr_code TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
      )
    `);
  });
}

module.exports = db; 