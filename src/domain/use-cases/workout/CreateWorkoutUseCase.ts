import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutEntity } from '../../entities/Workout';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export interface CreateWorkoutInput {
  name: string;
  description?: string;
}

export class CreateWorkoutUseCase {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(input: CreateWorkoutInput): Promise<Workout> {
    const { name, description } = input;

    if (!name) {
      throw new Error('Workout name is required');
    }

    const workout = WorkoutEntity.create(uuidv4(), name, description);
    return this.workoutRepository.create(workout);
  }
} 