import { Request, Response } from 'express';
import { CreateExerciseUseCase } from '../../domain/use-cases/exercise/CreateExerciseUseCase';
import { GetExerciseUseCase } from '../../domain/use-cases/exercise/GetExerciseUseCase';
import { ListExercisesUseCase } from '../../domain/use-cases/exercise/ListExercisesUseCase';
import { UpdateExerciseUseCase } from '../../domain/use-cases/exercise/UpdateExerciseUseCase';
import { DeleteExerciseUseCase } from '../../domain/use-cases/exercise/DeleteExerciseUseCase';

export class ExerciseController {
  constructor(
    private readonly createExerciseUseCase: CreateExerciseUseCase,
    private readonly getExerciseUseCase: GetExerciseUseCase,
    private readonly listExercisesUseCase: ListExercisesUseCase,
    private readonly updateExerciseUseCase: UpdateExerciseUseCase,
    private readonly deleteExerciseUseCase: DeleteExerciseUseCase
  ) {}

  async createExercise(req: Request, res: Response): Promise<void> {
    try {
      const { name, muscleGroup } = req.body;
      const exercise = await this.createExerciseUseCase.execute({ name, muscleGroup });
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAllExercises(req: Request, res: Response): Promise<void> {
    try {
      const exercises = await this.listExercisesUseCase.execute();
      res.json(exercises);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getExerciseById(req: Request, res: Response): Promise<void> {
    try {
      const exercise = await this.getExerciseUseCase.execute(req.params.id);
      res.json(exercise);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateExercise(req: Request, res: Response): Promise<void> {
    try {
      const { name, muscleGroup } = req.body;
      const exercise = await this.updateExerciseUseCase.execute({
        id: req.params.id,
        name,
        muscleGroup
      });
      res.json(exercise);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteExercise(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteExerciseUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 