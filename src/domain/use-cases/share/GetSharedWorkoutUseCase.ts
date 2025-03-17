import { SharedWorkout } from '../../entities/SharedWorkout';
import { Workout } from '../../entities/Workout';
import { SharedWorkoutRepository } from '../../ports/repositories/SharedWorkoutRepository';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export interface SharedWorkoutDetails {
  share: SharedWorkout;
  workout: Workout;
}

export class GetSharedWorkoutUseCase {
  constructor(
    private sharedWorkoutRepository: SharedWorkoutRepository,
    private workoutRepository: WorkoutRepository
  ) {}

  async execute(shareId: string): Promise<SharedWorkoutDetails | null> {
    // Busca o compartilhamento pelo ID
    const share = await this.sharedWorkoutRepository.findById(shareId);
    if (!share) {
      return null;
    }

    // Busca o workout associado ao compartilhamento
    const workout = await this.workoutRepository.findById(share.workoutId);
    if (!workout) {
      return null;
    }

    // Retorna os detalhes do compartilhamento e do workout
    return {
      share,
      workout
    };
  }
} 