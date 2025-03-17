import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export class GetWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(id: string): Promise<Workout | null> {
    const workout = await this.workoutRepository.findById(id);
    
    if (!workout) {
      return null;
    }
    
    return workout;
  }
} 