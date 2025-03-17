import { Request, Response } from 'express';
import { CreateWorkoutUseCase } from '../../domain/use-cases/workout/CreateWorkoutUseCase';
import { GetWorkoutUseCase } from '../../domain/use-cases/workout/GetWorkoutUseCase';
import { ListWorkoutsUseCase } from '../../domain/use-cases/workout/ListWorkoutsUseCase';
import { UpdateWorkoutUseCase } from '../../domain/use-cases/workout/UpdateWorkoutUseCase';
import { DeleteWorkoutUseCase } from '../../domain/use-cases/workout/DeleteWorkoutUseCase';
import { AddExerciseToWorkoutUseCase } from '../../domain/use-cases/workout/AddExerciseToWorkoutUseCase';

export class WorkoutController {
  constructor(
    private readonly createWorkoutUseCase: CreateWorkoutUseCase,
    private readonly getWorkoutUseCase: GetWorkoutUseCase,
    private readonly listWorkoutsUseCase: ListWorkoutsUseCase,
    private readonly updateWorkoutUseCase: UpdateWorkoutUseCase,
    private readonly deleteWorkoutUseCase: DeleteWorkoutUseCase,
    private readonly addExerciseToWorkoutUseCase: AddExerciseToWorkoutUseCase
  ) {}

  async createWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const workout = await this.createWorkoutUseCase.execute({ name, description });
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAllWorkouts(req: Request, res: Response): Promise<void> {
    try {
      const workouts = await this.listWorkoutsUseCase.execute();
      res.json(workouts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getWorkoutById(req: Request, res: Response): Promise<void> {
    try {
      const workout = await this.getWorkoutUseCase.execute(req.params.id);
      
      if (!workout) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }
      
      res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const workout = await this.updateWorkoutUseCase.execute({
        id: req.params.id,
        name,
        description
      });
      
      if (!workout) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }
      
      res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteWorkout(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.deleteWorkoutUseCase.execute(id);
      
      if (result === false) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async addExerciseToWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { exerciseId, reps, interval } = req.body;
      const workout = await this.addExerciseToWorkoutUseCase.execute({
        workoutId: req.params.id,
        exerciseId,
        reps,
        interval
      });
      
      if (!workout) {
        res.status(404).json({ error: 'Workout or exercise not found' });
        return;
      }
      
      res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 