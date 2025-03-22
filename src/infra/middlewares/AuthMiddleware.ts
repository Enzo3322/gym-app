import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export class AuthMiddleware {
  constructor(private jwtSecret: string) {}

  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Authentication token is required' });
      }

      const parts = authHeader.split(' ');

      if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token error' });
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatted' });
      }

      try {
        const decoded = jwt.verify(token, this.jwtSecret) as {
          id: string;
          email: string;
          role: UserRole;
        };

        req.user = decoded;
        
        return next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }

  authorize(roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (roles.includes(req.user.role)) {
        return next();
      }

      return res.status(403).json({ error: 'Insufficient permissions' });
    };
  }
}