export interface SharedWorkout {
  id: string;
  workoutId: string;
  link: string;
  qrCode: string;
  createdAt: Date;
}

export class SharedWorkoutEntity implements SharedWorkout {
  constructor(
    public readonly id: string,
    public readonly workoutId: string,
    public readonly link: string,
    public readonly qrCode: string,
    public readonly createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Shared workout ID is required');
    }
    if (!this.workoutId) {
      throw new Error('Workout ID is required');
    }
    if (!this.link) {
      throw new Error('Link is required');
    }
    if (!this.qrCode) {
      throw new Error('QR Code is required');
    }
  }

  static create(id: string, workoutId: string, link: string, qrCode: string): SharedWorkoutEntity {
    return new SharedWorkoutEntity(id, workoutId, link, qrCode, new Date());
  }
} 