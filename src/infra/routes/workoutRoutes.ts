import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';

export const makeWorkoutRoutes = (workoutController: WorkoutController) => {
  const router = Router();

  // Rotas para gerenciar workouts
  router.post('/', workoutController.createWorkout.bind(workoutController));
  router.get('/', workoutController.getAllWorkouts.bind(workoutController));
  router.get('/:id', workoutController.getWorkoutById.bind(workoutController));
  router.put('/:id', workoutController.updateWorkout.bind(workoutController));
  router.delete('/:id', workoutController.deleteWorkout.bind(workoutController));
  
  // Rota para adicionar exercício a um workout
  router.post('/:id/exercises', workoutController.addExerciseToWorkout.bind(workoutController));

  return router;
}; 