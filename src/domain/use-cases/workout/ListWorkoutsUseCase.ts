import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export class ListWorkoutsUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(): Promise<Workout[]> {
    return this.workoutRepository.findAll();
  }
} 