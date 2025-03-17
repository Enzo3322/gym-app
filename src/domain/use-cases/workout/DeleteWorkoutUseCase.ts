import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export class DeleteWorkoutUseCase {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(id: string): Promise<boolean> {
    const workout = await this.workoutRepository.findById(id);
    
    if (!workout) {
      return false;
    }
    
    await this.workoutRepository.delete(id);
    return true;
  }
} 