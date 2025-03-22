import bcrypt from 'bcrypt';
import { User, UserEntity, UserRole } from '../../entities/User';
import { UserRepository } from '../../ports/repositories/UserRepository';

interface UpdateUserParams {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, params: UpdateUserParams): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Se o email estiver sendo atualizado, verificar se já existe
    if (params.email && params.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(params.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Preparar a senha se estiver sendo atualizada
    let password = user.password;
    if (params.password) {
      password = await bcrypt.hash(params.password, 10);
    }

    const updatedUser = UserEntity.create(
      user.id,
      params.name || user.name,
      params.email || user.email,
      password,
      params.role || user.role,
      user.createdAt
    );

    return this.userRepository.update(updatedUser);
  }
}