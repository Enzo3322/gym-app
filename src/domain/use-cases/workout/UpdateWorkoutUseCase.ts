import { Workout, WorkoutEntity } from '../../entities/Workout';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

interface UpdateWorkoutRequest {
  id: string;
  name: string;
  description?: string;
}

export class UpdateWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(request: UpdateWorkoutRequest): Promise<Workout | null> {
    const existingWorkout = await this.workoutRepository.findById(request.id);
    
    if (!existingWorkout) {
      return null;
    }
    
    const updatedWorkout = {
      ...existingWorkout,
      name: request.name,
      description: request.description
    };
    
    return this.workoutRepository.update(updatedWorkout);
  }
} 