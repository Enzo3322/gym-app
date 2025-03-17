export interface Exercise {
  id: string;
  name: string;
  muscleGroup?: string;
}

export class ExerciseEntity implements Exercise {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly muscleGroup?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Exercise ID is required');
    }
    if (!this.name) {
      throw new Error('Exercise name is required');
    }
  }

  static create(id: string, name: string, muscleGroup?: string): ExerciseEntity {
    return new ExerciseEntity(id, name, muscleGroup);
  }
} 