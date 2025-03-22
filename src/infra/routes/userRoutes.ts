import express from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export const makeUserRoutes = (
  userController: UserController,
  authMiddleware: AuthMiddleware
) => {
  const router = express.Router();

  // Criação de usuário (disponível publicamente para registro)
  router.post('/', (req, res) => userController.create(req, res));

  // Rotas protegidas que requerem autenticação
  router.use(authMiddleware.authenticate());

  // Listar usuários (apenas admin e root)
  router.get('/', 
    authMiddleware.authorize(['admin', 'root']),
    (req, res) => userController.listUsers(req, res)
  );

  // Obter um usuário específico (o próprio usuário ou admin/root)
  router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const requestUser = req.user!;

    // Permite que o usuário acesse seus próprios dados ou admin/root acessem qualquer usuário
    if (userId === requestUser.id || ['admin', 'root'].includes(requestUser.role)) {
      return userController.getUser(req, res);
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  });

  // Atualizar usuário (o próprio usuário ou admin/root)
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

  // Deletar usuário (apenas admin e root)
  router.delete('/:id', 
    authMiddleware.authorize(['admin', 'root']),
    (req, res) => userController.delete(req, res)
  );

  return router;
};