import { Router } from 'express';
import { ShareController } from '../controllers/ShareController';

/**
 * @swagger
 * tags:
 *   name: Sharing
 *   description: Workout sharing APIs
 */

export const makeShareRoutes = (shareController: ShareController) => {
  const router = Router();

  /**
   * @swagger
   * /api/share/workouts/{workoutId}:
   *   post:
   *     summary: Share a workout
   *     tags: [Sharing]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: workoutId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Workout ID to share
   *     responses:
   *       201:
   *         description: Workout shared successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SharedWorkout'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only share your own workouts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Workout not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/workouts/:workoutId', shareController.shareWorkout.bind(shareController));
  
  /**
   * @swagger
   * /api/share/{shareId}:
   *   get:
   *     summary: Get a shared workout
   *     tags: [Sharing]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shareId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Share ID
   *     responses:
   *       200:
   *         description: Shared workout details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SharedWorkout'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Shared workout not found or expired
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:shareId', shareController.getSharedWorkout.bind(shareController));
  
  /**
   * @swagger
   * /api/share/{shareId}:
   *   delete:
   *     summary: Delete a shared workout
   *     tags: [Sharing]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shareId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Share ID
   *     responses:
   *       204:
   *         description: Shared workout deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only delete your own shared workouts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Shared workout not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:shareId', shareController.deleteShare.bind(shareController));

  return router;
}; 