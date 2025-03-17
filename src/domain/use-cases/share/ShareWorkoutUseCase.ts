import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { SharedWorkout, SharedWorkoutEntity } from '../../entities/SharedWorkout';
import { SharedWorkoutRepository } from '../../ports/repositories/SharedWorkoutRepository';
import { WorkoutRepository } from '../../ports/repositories/WorkoutRepository';

export class ShareWorkoutUseCase {
  constructor(
    private sharedWorkoutRepository: SharedWorkoutRepository,
    private workoutRepository: WorkoutRepository,
    private baseUrl: string
  ) {}

  async execute(workoutId: string): Promise<SharedWorkout | null> {
    // Verifica se o workout existe
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) {
      return null;
    }

    // Verifica se o workout já foi compartilhado anteriormente
    const existingShares = await this.sharedWorkoutRepository.findByWorkoutId(workoutId);
    if (existingShares.length > 0) {
      // Se já foi compartilhado, retorna o compartilhamento existente
      return existingShares[0];
    }

    // Cria um novo ID para o compartilhamento
    const shareId = uuidv4();
    
    // Gera a URL de compartilhamento
    const shareLink = `${this.baseUrl}/share/${shareId}`;
    
    // Gera o QR Code
    const qrCode = await QRCode.toDataURL(shareLink);
    
    // Cria o objeto de compartilhamento
    const sharedWorkout = SharedWorkoutEntity.create(
      shareId,
      workoutId,
      shareLink,
      qrCode
    );
    
    // Salva no repositório
    return this.sharedWorkoutRepository.create(sharedWorkout);
  }
} 