export interface Exercise {
  id: string;
  name: string;
  muscleGroup?: string;
}

export interface WorkoutExercise extends Exercise {
  reps: number;
  interval: number;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
}

export interface SharedWorkout {
  share_id: string;
  link: string;
  qr_code: string;
  workout_id: string;
  workout_name: string;
  workout_description?: string;
  exercises: WorkoutExercise[];
}

export interface ApiError {
  error: string;
}

export interface CreateExerciseData {
  name: string;
  muscleGroup?: string;
}

export interface CreateWorkoutData {
  name: string;
  description?: string;
}

export interface AddExerciseToWorkoutData {
  exerciseId: string;
  reps: number;
  interval: number;
} 