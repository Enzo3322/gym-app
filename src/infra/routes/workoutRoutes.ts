import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management APIs
 */

export const makeWorkoutRoutes = (workoutController: WorkoutController) => {
  const router = Router();

  /**
   * @swagger
   * /api/workouts:
   *   post:
   *     summary: Create a new workout
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/WorkoutCreate'
   *     responses:
   *       201:
   *         description: Workout created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Workout'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', workoutController.createWorkout.bind(workoutController));
  
  /**
   * @swagger
   * /api/workouts:
   *   get:
   *     summary: Get all workouts for the authenticated user
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of workouts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Workout'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', workoutController.getAllWorkouts.bind(workoutController));
  
  /**
   * @swagger
   * /api/workouts/{id}:
   *   get:
   *     summary: Get workout by ID
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Workout ID
   *     responses:
   *       200:
   *         description: Workout details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Workout'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only view your own workouts
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
  router.get('/:id', workoutController.getWorkoutById.bind(workoutController));
  
  /**
   * @swagger
   * /api/workouts/{id}:
   *   put:
   *     summary: Update a workout
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Workout ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/WorkoutUpdate'
   *     responses:
   *       200:
   *         description: Workout updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Workout'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only update your own workouts
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
  router.put('/:id', workoutController.updateWorkout.bind(workoutController));
  
  /**
   * @swagger
   * /api/workouts/{id}:
   *   delete:
   *     summary: Delete a workout
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Workout ID
   *     responses:
   *       204:
   *         description: Workout deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only delete your own workouts
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
  router.delete('/:id', workoutController.deleteWorkout.bind(workoutController));
  
  /**
   * @swagger
   * /api/workouts/{id}/exercises:
   *   post:
   *     summary: Add an exercise to a workout
   *     tags: [Workouts]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Workout ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AddExerciseToWorkout'
   *     responses:
   *       201:
   *         description: Exercise added to workout successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Workout'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only modify your own workouts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Workout or exercise not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/:id/exercises', workoutController.addExerciseToWorkout.bind(workoutController));

  return router;
}; 