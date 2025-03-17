import { v4 as uuidv4 } from 'uuid';
import { Exercise, ExerciseEntity } from '../../entities/Exercise';
import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';

export interface CreateExerciseInput {
  name: string;
  muscleGroup?: string;
}

export class CreateExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(input: CreateExerciseInput): Promise<Exercise> {
    const { name, muscleGroup } = input;

    if (!name) {
      throw new Error('Exercise name is required');
    }

    const existingExercise = await this.exerciseRepository.findByName(name);
    if (existingExercise) {
      throw new Error('Exercise already exists');
    }

    const exercise = ExerciseEntity.create(uuidv4(), name, muscleGroup);
    return this.exerciseRepository.create(exercise);
  }
} 