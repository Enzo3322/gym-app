import { Router } from 'express';
import { ExerciseController } from '../controllers/ExerciseController';
import { mutationLimiter } from '../middlewares/rateLimiters';

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise management APIs
 */

export const makeExerciseRoutes = (exerciseController: ExerciseController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/exercises:
   *   post:
   *     summary: Create a new exercise
   *     tags: [Exercises]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ExerciseCreate'
   *     responses:
   *       201:
   *         description: Exercise created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
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
   *         description: Forbidden - Only admins can create exercises
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       429:
   *         description: Too many requests
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', mutationLimiter, (req, res) => exerciseController.createExercise(req, res));

  /**
   * @swagger
   * /api/exercises:
   *   get:
   *     summary: Get all exercises
   *     tags: [Exercises]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of exercises
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Exercise'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Only admins can view all exercises
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', (req, res) => exerciseController.getAllExercises(req, res));

  /**
   * @swagger
   * /api/exercises/{id}:
   *   get:
   *     summary: Get exercise by ID
   *     tags: [Exercises]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Exercise ID
   *     responses:
   *       200:
   *         description: Exercise details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Only admins can view exercise details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercise not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', (req, res) => exerciseController.getExerciseById(req, res));

  /**
   * @swagger
   * /api/exercises/{id}:
   *   put:
   *     summary: Update an exercise
   *     tags: [Exercises]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Exercise ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ExerciseUpdate'
   *     responses:
   *       200:
   *         description: Exercise updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercise'
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
   *         description: Forbidden - Only admins can update exercises
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercise not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       429:
   *         description: Too many requests
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', mutationLimiter, (req, res) => exerciseController.updateExercise(req, res));

  /**
   * @swagger
   * /api/exercises/{id}:
   *   delete:
   *     summary: Delete an exercise
   *     tags: [Exercises]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Exercise ID
   *     responses:
   *       204:
   *         description: Exercise deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Only admins can delete exercises
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercise not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       429:
   *         description: Too many requests
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', mutationLimiter, (req, res) => exerciseController.deleteExercise(req, res));

  return router;
}; 