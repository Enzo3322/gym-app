import { Exercise, ExerciseEntity } from '../../entities/Exercise';
import { ExerciseRepository } from '../../ports/repositories/ExerciseRepository';

export interface UpdateExerciseInput {
  id: string;
  name?: string;
  muscleGroup?: string;
}

export class UpdateExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(input: UpdateExerciseInput): Promise<Exercise> {
    const { id, name, muscleGroup } = input;

    const existingExercise = await this.exerciseRepository.findById(id);
    if (!existingExercise) {
      throw new Error('Exercise not found');
    }

    if (name && name !== existingExercise.name) {
      const exerciseWithSameName = await this.exerciseRepository.findByName(name);
      if (exerciseWithSameName && exerciseWithSameName.id !== id) {
        throw new Error('Exercise name already exists');
      }
    }

    const updatedExercise = ExerciseEntity.create(
      id,
      name || existingExercise.name,
      muscleGroup !== undefined ? muscleGroup : existingExercise.muscleGroup
    );

    return this.exerciseRepository.update(updatedExercise);
  }
} 