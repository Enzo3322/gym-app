import { User } from '../../entities/User';
import { UserRepository } from '../../ports/repositories/UserRepository';

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}