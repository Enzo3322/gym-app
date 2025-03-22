import { Request, Response } from 'express';
import { LoginUseCase } from '../../domain/use-cases/auth/LoginUseCase';

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await this.loginUseCase.execute(email, password);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password') {
          return res.status(401).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Error during login' });
    }
  }
}