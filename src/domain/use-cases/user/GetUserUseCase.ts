import { User } from '../../entities/User';
import { UserRepository } from '../../ports/repositories/UserRepository';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}