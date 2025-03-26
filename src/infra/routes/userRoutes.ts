import express from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

export const makeUserRoutes = (
  userController: UserController,
  authMiddleware: AuthMiddleware
) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user (register)
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserCreate'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Invalid input data or email already registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', (req, res) => userController.create(req, res));

  // Rotas protegidas que requerem autenticação
  router.use(authMiddleware.authenticate());

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: List all users (admin only)
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Only admin and root users can list all users
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', 
    authMiddleware.authorize(['admin', 'root']),
    (req, res) => userController.listUsers(req, res)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Users can only get their own data, admin and root can get any user data
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - You can only view your own user data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const requestUser = req.user!;

    // Permite que o usuário acesse seus próprios dados ou admin/root acessem qualquer usuário
    if (userId === requestUser.id || ['admin', 'root'].includes(requestUser.role)) {
      return userController.getUser(req, res);
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update a user
   *     description: Users can only update their own data, admin and root can update any user data
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdate'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
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
   *         description: Forbidden - Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const requestUser = req.user!;
    const requestedRole = req.body.role;

    // Apenas root pode alterar para role 'root'
    if (requestedRole === 'root' && requestUser.role !== 'root') {
      return res.status(403).json({ error: 'Insufficient permissions to assign root role' });
    }

    // Apenas admin e root podem alterar roles
    if (requestedRole && requestUser.role === 'user') {
      return res.status(403).json({ error: 'Insufficient permissions to change roles' });
    }

    // Permite que o usuário atualize seus próprios dados ou admin/root atualizem qualquer usuário
    if (userId === requestUser.id || ['admin', 'root'].includes(requestUser.role)) {
      return userController.update(req, res);
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  });

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Only admin and root users can delete users
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Only admin and root users can delete users
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', 
    authMiddleware.authorize(['admin', 'root']),
    (req, res) => userController.delete(req, res)
  );

  return router;
};