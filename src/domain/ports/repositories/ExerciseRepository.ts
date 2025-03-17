import { Exercise } from '../../entities/Exercise';

export interface ExerciseRepository {
  create(exercise: Exercise): Promise<Exercise>;
  findAll(): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
  findByName(name: string): Promise<Exercise | null>;
  update(exercise: Exercise): Promise<Exercise>;
  delete(id: string): Promise<void>;
} 