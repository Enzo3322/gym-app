import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutExercise } from '../../../domain/entities/Workout';
import { WorkoutRepository } from '../../../domain/ports/repositories/WorkoutRepository';
import { db } from '../../database/connection';
import { workouts, workoutExercises, exercises } from '../../database/schema';

export class DrizzleWorkoutRepository implements WorkoutRepository {
  async create(workout: Workout): Promise<Workout> {
    await db.insert(workouts).values({
      id: workout.id,
      name: workout.name,
      description: workout.description
    });

    if (workout.exercises && workout.exercises.length > 0) {
      const workoutExercisesData = workout.exercises.map(exercise => ({
        id: uuidv4(),
        workoutId: workout.id,
        exerciseId: exercise.exerciseId,
        reps: exercise.reps,
        interval: exercise.interval,
        weight: exercise.weight
      }));

      await db.insert(workoutExercises).values(workoutExercisesData);
    }

    return workout;
  }

  async findAll(): Promise<Workout[]> {
    const result = await db.select().from(workouts);
    
    const workoutsWithExercises = await Promise.all(
      result.map(async workout => {
        const exercises = await this.getWorkoutExercises(workout.id);
        
        return {
          id: workout.id,
          name: workout.name,
          description: workout.description || undefined,
          exercises
        };
      })
    );
    
    return workoutsWithExercises;
  }

  async findById(id: string): Promise<Workout | null> {
    const result = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const workout = result[0];
    const exercises = await this.getWorkoutExercises(id);
    
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description || undefined,
      exercises
    };
  }

  async update(workout: Workout): Promise<Workout> {
    await db.update(workouts)
      .set({
        name: workout.name,
        description: workout.description
      })
      .where(eq(workouts.id, workout.id));

    return workout;
  }

  async delete(id: string): Promise<void> {
    // Primeiro, exclui os exercícios associados ao treino
    await db.delete(workoutExercises).where(eq(workoutExercises.workoutId, id));
    
    // Em seguida, exclui o treino
    await db.delete(workouts).where(eq(workouts.id, id));
  }

  async addExercise(workoutId: string, exercise: WorkoutExercise): Promise<void> {
    await db.insert(workoutExercises).values({
      id: uuidv4(),
      workoutId,
      exerciseId: exercise.exerciseId,
      reps: exercise.reps,
      interval: exercise.interval,
      weight: exercise.weight
    });
  }

  async removeExercise(workoutId: string, exerciseId: string): Promise<void> {
    await db.delete(workoutExercises)
      .where(
        and(
          eq(workoutExercises.workoutId, workoutId),
          eq(workoutExercises.exerciseId, exerciseId)
        )
      );
  }

  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    const result = await db.select({
      exercise: exercises,
      workoutExercise: workoutExercises
    })
    .from(workoutExercises)
    .leftJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(eq(workoutExercises.workoutId, workoutId));
    
    return result.map(item => ({
      exerciseId: item.workoutExercise.exerciseId,
      reps: item.workoutExercise.reps || undefined,
      interval: item.workoutExercise.interval || undefined,
      weight: item.workoutExercise.weight || undefined,
      name: item.exercise?.name || '',
      muscleGroup: item.exercise?.muscleGroup || undefined
    }));
  }
} 