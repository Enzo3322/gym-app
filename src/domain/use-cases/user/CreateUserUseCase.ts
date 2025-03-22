import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User, UserEntity, UserRole } from '../../entities/User';
import { UserRepository } from '../../ports/repositories/UserRepository';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, password: string, role: UserRole = 'user'): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = UserEntity.create(
      userId,
      name,
      email,
      hashedPassword,
      role
    );

    return this.userRepository.create(user);
  }
}