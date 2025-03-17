import { Request, Response } from 'express';
import { ShareWorkoutUseCase } from '../../domain/use-cases/share/ShareWorkoutUseCase';
import { GetSharedWorkoutUseCase } from '../../domain/use-cases/share/GetSharedWorkoutUseCase';
import { DeleteShareUseCase } from '../../domain/use-cases/share/DeleteShareUseCase';

export class ShareController {
  constructor(
    private readonly shareWorkoutUseCase: ShareWorkoutUseCase,
    private readonly getSharedWorkoutUseCase: GetSharedWorkoutUseCase,
    private readonly deleteShareUseCase: DeleteShareUseCase
  ) {}

  async shareWorkout(req: Request, res: Response): Promise<void> {
    try {
      const workoutId = req.params.workoutId;
      const sharedWorkout = await this.shareWorkoutUseCase.execute(workoutId);
      
      if (!sharedWorkout) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }
      
      res.status(201).json(sharedWorkout);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getSharedWorkout(req: Request, res: Response): Promise<void> {
    try {
      const shareId = req.params.shareId;
      const sharedWorkoutDetails = await this.getSharedWorkoutUseCase.execute(shareId);
      
      if (!sharedWorkoutDetails) {
        res.status(404).json({ error: 'Shared workout not found' });
        return;
      }
      
      res.json(sharedWorkoutDetails);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteShare(req: Request, res: Response): Promise<void> {
    try {
      const shareId = req.params.shareId;
      const success = await this.deleteShareUseCase.execute(shareId);
      
      if (!success) {
        res.status(404).json({ error: 'Shared workout not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 