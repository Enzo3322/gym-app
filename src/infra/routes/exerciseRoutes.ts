import { Router } from 'express';
import { ExerciseController } from '../controllers/ExerciseController';
import { mutationLimiter } from '../middlewares/rateLimiters';

export const makeExerciseRoutes = (exerciseController: ExerciseController): Router => {
  const router = Router();

  // Create a new exercise
  router.post('/', mutationLimiter, (req, res) => exerciseController.createExercise(req, res));

  // Get all exercises
  router.get('/', (req, res) => exerciseController.getAllExercises(req, res));

  // Get a specific exercise
  router.get('/:id', (req, res) => exerciseController.getExerciseById(req, res));

  // Update an exercise
  router.put('/:id', mutationLimiter, (req, res) => exerciseController.updateExercise(req, res));

  // Delete an exercise
  router.delete('/:id', mutationLimiter, (req, res) => exerciseController.deleteExercise(req, res));

  return router;
}; 