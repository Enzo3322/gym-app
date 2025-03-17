import { Router } from 'express';
import { ShareController } from '../controllers/ShareController';

export const makeShareRoutes = (shareController: ShareController) => {
  const router = Router();

  // Compartilhar um workout
  router.post('/workouts/:workoutId', shareController.shareWorkout.bind(shareController));
  
  // Obter um workout compartilhado
  router.get('/:shareId', shareController.getSharedWorkout.bind(shareController));
  
  // Excluir um compartilhamento
  router.delete('/:shareId', shareController.deleteShare.bind(shareController));

  return router;
}; 