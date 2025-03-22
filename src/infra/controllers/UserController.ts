import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../domain/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../domain/use-cases/user/GetUserUseCase';
import { ListUsersUseCase } from '../../domain/use-cases/user/ListUsersUseCase';
import { UpdateUserUseCase } from '../../domain/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../domain/use-cases/user/DeleteUserUseCase';
import { UserRole } from '../../domain/entities/User';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }

      const user = await this.createUserUseCase.execute(name, email, password, role as UserRole);

      // Remove sensitive data from response
      const { password: _, ...userData } = user;

      return res.status(201).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User with this email already exists') {
          return res.status(409).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove sensitive data from response
      const { password, ...userData } = user;

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({ error: 'Error getting user' });
    }
  }

  async listUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.listUsersUseCase.execute();
      
      const usersData = users.map(user => {
        const { password, ...userData } = user;
        return userData;
      });

      return res.status(200).json(usersData);
    } catch (error) {
      return res.status(500).json({ error: 'Error listing users' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      const updatedUser = await this.updateUserUseCase.execute(id, {
        name,
        email,
        password,
        role: role as UserRole
      });

      // Remove sensitive data from response
      const { password: _, ...userData } = updatedUser;

      return res.status(200).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Email already in use') {
          return res.status(409).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Error updating user' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return res.status(404).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Error deleting user' });
    }
  }
}