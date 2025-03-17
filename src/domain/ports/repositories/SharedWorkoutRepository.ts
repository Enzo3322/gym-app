import { SharedWorkout } from '../../entities/SharedWorkout';

export interface SharedWorkoutRepository {
  create(sharedWorkout: SharedWorkout): Promise<SharedWorkout>;
  findById(id: string): Promise<SharedWorkout | null>;
  findByWorkoutId(workoutId: string): Promise<SharedWorkout[]>;
  delete(id: string): Promise<void>;
} 