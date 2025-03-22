import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group'),
});

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id')
    .notNull()
    .references(() => workouts.id),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id),
  reps: integer('reps'),
  interval: integer('interval'),
});

export const sharedWorkouts = sqliteTable('shared_workouts', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  link: text('link').notNull(),
  qrCode: text('qr_code').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['user', 'admin', 'root'] }).notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});