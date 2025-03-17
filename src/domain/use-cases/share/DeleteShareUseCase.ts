import { SharedWorkoutRepository } from '../../ports/repositories/SharedWorkoutRepository';

export class DeleteShareUseCase {
  constructor(private sharedWorkoutRepository: SharedWorkoutRepository) {}

  async execute(shareId: string): Promise<boolean> {
    // Verifica se o compartilhamento existe
    const share = await this.sharedWorkoutRepository.findById(shareId);
    if (!share) {
      return false;
    }

    // Exclui o compartilhamento
    await this.sharedWorkoutRepository.delete(shareId);
    return true;
  }
} 