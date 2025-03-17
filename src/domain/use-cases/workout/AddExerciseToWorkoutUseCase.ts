import { Workout, WorkoutExercise } from '../../entities/Workout';
import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export interface AddExerciseToWorkoutInput {
  workoutId: string;
  exerciseId: string;
  reps?: number;
  interval?: number;
}

export class AddExerciseToWorkoutUseCase {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(input: AddExerciseToWorkoutInput): Promise<Workout | null> {
    const { workoutId, exerciseId, reps, interval } = input;

    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    const workoutExercise: WorkoutExercise = {
      exerciseId,
      reps,
      interval
    };

    await this.workoutRepository.addExercise(workoutId, workoutExercise);
    
    // Return the updated workout
    return this.workoutRepository.findById(workoutId);
  }
} 