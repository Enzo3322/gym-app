import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';

export class DeleteExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(id: string): Promise<void> {
    const exercise = await this.exerciseRepository.findById(id);
    
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    
    await this.exerciseRepository.delete(id);
  }
} 