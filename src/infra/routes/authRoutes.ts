import express from 'express';
import { AuthController } from '../controllers/AuthController';

export const makeAuthRoutes = (authController: AuthController) => {
  const router = express.Router();

  // Login
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};