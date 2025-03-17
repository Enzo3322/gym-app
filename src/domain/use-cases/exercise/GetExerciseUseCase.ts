import { Exercise } from '../../entities/Exercise';
import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';

export class GetExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(id);
    
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    
    return exercise;
  }
} 