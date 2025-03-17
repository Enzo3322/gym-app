import { eq } from 'drizzle-orm';
import { Exercise, ExerciseEntity } from '../../../domain/entities/Exercise';
import { ExerciseRepository } from '../../../domain/ports/repositories/ExerciseRepository';
import { db } from '../../database/connection';
import { exercises } from '../../database/schema';

export class DrizzleExerciseRepository implements ExerciseRepository {
  async create(exercise: Exercise): Promise<Exercise> {
    await db.insert(exercises).values({
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup
    });

    return exercise;
  }

  async findAll(): Promise<Exercise[]> {
    const result = await db.select().from(exercises);
    
    return result.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup || undefined
    }));
  }

  async findById(id: string): Promise<Exercise | null> {
    const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const exercise = result[0];
    return {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup || undefined
    };
  }

  async findByName(name: string): Promise<Exercise | null> {
    const result = await db.select().from(exercises).where(eq(exercises.name, name)).limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const exercise = result[0];
    return {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup || undefined
    };
  }

  async update(exercise: Exercise): Promise<Exercise> {
    await db.update(exercises)
      .set({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup
      })
      .where(eq(exercises.id, exercise.id));

    return exercise;
  }

  async delete(id: string): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, id));
  }
} 