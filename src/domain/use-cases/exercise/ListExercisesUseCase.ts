import { Exercise } from '../../entities/Exercise';
import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';

export class ListExercisesUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(): Promise<Exercise[]> {
    return this.exerciseRepository.findAll();
  }
} 