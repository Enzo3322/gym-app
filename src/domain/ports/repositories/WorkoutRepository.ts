import { Workout, WorkoutExercise } from '../../entities/Workout';

export interface WorkoutRepository {
  create(workout: Workout): Promise<Workout>;
  findAll(): Promise<Workout[]>;
  findById(id: string): Promise<Workout | null>;
  update(workout: Workout): Promise<Workout>;
  delete(id: string): Promise<void>;
  addExercise(workoutId: string, exercise: WorkoutExercise): Promise<void>;
  removeExercise(workoutId: string, exerciseId: string): Promise<void>;
  getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]>;
} 