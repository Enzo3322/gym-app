import { Exercise } from './Exercise';

export interface WorkoutExercise {
  exerciseId: string;
  reps?: number;
  interval?: number;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises?: WorkoutExercise[];
}

export class WorkoutEntity implements Workout {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly exercises: WorkoutExercise[] = []
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Workout ID is required');
    }
    if (!this.name) {
      throw new Error('Workout name is required');
    }
  }

  static create(id: string, name: string, description?: string, exercises: WorkoutExercise[] = []): WorkoutEntity {
    return new WorkoutEntity(id, name, description, exercises);
  }

  addExercise(exerciseId: string, reps?: number, interval?: number): WorkoutEntity {
    const exercises = [
      ...this.exercises,
      { exerciseId, reps, interval }
    ];
    return new WorkoutEntity(this.id, this.name, this.description, exercises);
  }

  removeExercise(exerciseId: string): WorkoutEntity {
    const exercises = this.exercises.filter(e => e.exerciseId !== exerciseId);
    return new WorkoutEntity(this.id, this.name, this.description, exercises);
  }
} 