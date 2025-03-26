import express from 'express';
import { AuthController } from '../controllers/AuthController';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

export const makeAuthRoutes = (authController: AuthController) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login to the application
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Login'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Authentication failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};