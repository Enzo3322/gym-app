import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Configuração do ambiente
dotenv.config();

// Importação dos repositórios
import { DrizzleExerciseRepository } from './infra/adapters/repositories/DrizzleExerciseRepository';
import { DrizzleWorkoutRepository } from './infra/adapters/repositories/DrizzleWorkoutRepository';
import { DrizzleSharedWorkoutRepository } from './infra/adapters/repositories/DrizzleSharedWorkoutRepository';
import { DrizzleUserRepository } from './infra/adapters/repositories/DrizzleUserRepository';

// Importação dos casos de uso
import { CreateExerciseUseCase } from './domain/use-cases/exercise/CreateExerciseUseCase';
import { GetExerciseUseCase } from './domain/use-cases/exercise/GetExerciseUseCase';
import { ListExercisesUseCase } from './domain/use-cases/exercise/ListExercisesUseCase';
import { UpdateExerciseUseCase } from './domain/use-cases/exercise/UpdateExerciseUseCase';
import { DeleteExerciseUseCase } from './domain/use-cases/exercise/DeleteExerciseUseCase';

// Importação dos casos de uso para workouts
import { CreateWorkoutUseCase } from './domain/use-cases/workout/CreateWorkoutUseCase';
import { GetWorkoutUseCase } from './domain/use-cases/workout/GetWorkoutUseCase';
import { ListWorkoutsUseCase } from './domain/use-cases/workout/ListWorkoutsUseCase';
import { UpdateWorkoutUseCase } from './domain/use-cases/workout/UpdateWorkoutUseCase';
import { DeleteWorkoutUseCase } from './domain/use-cases/workout/DeleteWorkoutUseCase';
import { AddExerciseToWorkoutUseCase } from './domain/use-cases/workout/AddExerciseToWorkoutUseCase';

// Importação dos casos de uso para compartilhamento
import { ShareWorkoutUseCase } from './domain/use-cases/share/ShareWorkoutUseCase';
import { GetSharedWorkoutUseCase } from './domain/use-cases/share/GetSharedWorkoutUseCase';
import { DeleteShareUseCase } from './domain/use-cases/share/DeleteShareUseCase';

// Importação dos casos de uso para usuários
import { CreateUserUseCase } from './domain/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from './domain/use-cases/user/GetUserUseCase';
import { ListUsersUseCase } from './domain/use-cases/user/ListUsersUseCase';
import { UpdateUserUseCase } from './domain/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from './domain/use-cases/user/DeleteUserUseCase';

// Importação do caso de uso para autenticação
import { LoginUseCase } from './domain/use-cases/auth/LoginUseCase';

// Importação de controladores
import { ExerciseController } from './infra/controllers/ExerciseController';
import { WorkoutController } from './infra/controllers/WorkoutController';
import { ShareController } from './infra/controllers/ShareController';
import { UserController } from './infra/controllers/UserController';
import { AuthController } from './infra/controllers/AuthController';

// Importação das rotas
import { makeExerciseRoutes } from './infra/routes/exerciseRoutes';
import { makeWorkoutRoutes } from './infra/routes/workoutRoutes';
import { makeShareRoutes } from './infra/routes/shareRoutes';
import { makeUserRoutes } from './infra/routes/userRoutes';
import { makeAuthRoutes } from './infra/routes/authRoutes';

// Importação do middleware de autenticação
import { AuthMiddleware } from './infra/middlewares/AuthMiddleware';

// Inicialização dos repositórios
const exerciseRepository = new DrizzleExerciseRepository();
const workoutRepository = new DrizzleWorkoutRepository();
const sharedWorkoutRepository = new DrizzleSharedWorkoutRepository();
const userRepository = new DrizzleUserRepository();

// Inicialização dos casos de uso
const createExerciseUseCase = new CreateExerciseUseCase(exerciseRepository);
const getExerciseUseCase = new GetExerciseUseCase(exerciseRepository);
const listExercisesUseCase = new ListExercisesUseCase(exerciseRepository);
const updateExerciseUseCase = new UpdateExerciseUseCase(exerciseRepository);
const deleteExerciseUseCase = new DeleteExerciseUseCase(exerciseRepository);

// Inicialização dos casos de uso para workouts
const createWorkoutUseCase = new CreateWorkoutUseCase(workoutRepository);
const getWorkoutUseCase = new GetWorkoutUseCase(workoutRepository);
const listWorkoutsUseCase = new ListWorkoutsUseCase(workoutRepository);
const updateWorkoutUseCase = new UpdateWorkoutUseCase(workoutRepository);
const deleteWorkoutUseCase = new DeleteWorkoutUseCase(workoutRepository);
const addExerciseToWorkoutUseCase = new AddExerciseToWorkoutUseCase(workoutRepository, exerciseRepository);

// Inicialização dos casos de uso para compartilhamento
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const shareWorkoutUseCase = new ShareWorkoutUseCase(sharedWorkoutRepository, workoutRepository, baseUrl);
const getSharedWorkoutUseCase = new GetSharedWorkoutUseCase(sharedWorkoutRepository, workoutRepository);
const deleteShareUseCase = new DeleteShareUseCase(sharedWorkoutRepository);

// Inicialização dos casos de uso para usuários
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Inicialização do caso de uso para autenticação
const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
const loginUseCase = new LoginUseCase(userRepository, jwtSecret);

// Inicialização do middleware de autenticação
const authMiddleware = new AuthMiddleware(jwtSecret);

// Inicialização dos controladores
const exerciseController = new ExerciseController(
  createExerciseUseCase,
  getExerciseUseCase,
  listExercisesUseCase,
  updateExerciseUseCase,
  deleteExerciseUseCase
);

const workoutController = new WorkoutController(
  createWorkoutUseCase,
  getWorkoutUseCase,
  listWorkoutsUseCase,
  updateWorkoutUseCase,
  deleteWorkoutUseCase,
  addExerciseToWorkoutUseCase
);

const shareController = new ShareController(
  shareWorkoutUseCase,
  getSharedWorkoutUseCase,
  deleteShareUseCase
);

const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  listUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

const authController = new AuthController(loginUseCase);

// Inicialização do Express
const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes, exceto em ambiente de teste
if (process.env.DISABLE_RATE_LIMIT !== 'true') {
  app.use(limiter);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', makeAuthRoutes(authController));
app.use('/api/users', makeUserRoutes(userController, authMiddleware));

// Rotas protegidas que requerem autenticação
app.use('/api/exercises', authMiddleware.authenticate(), authMiddleware.authorize(['admin', 'root']), makeExerciseRoutes(exerciseController));
app.use('/api/workouts', authMiddleware.authenticate(), makeWorkoutRoutes(workoutController));
app.use('/api/share', authMiddleware.authenticate(), makeShareRoutes(shareController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Não inicia o servidor se estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;