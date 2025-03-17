import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DeleteShareUseCase } from '../../../../domain/use-cases/share/DeleteShareUseCase';
import { SharedWorkoutRepository } from '../../../../domain/ports/repositories/SharedWorkoutRepository';
import { SharedWorkout } from '../../../../domain/entities/SharedWorkout';

describe('DeleteShareUseCase', () => {
  let deleteShareUseCase: DeleteShareUseCase;
  let mockSharedWorkoutRepository: jest.Mocked<SharedWorkoutRepository>;

  beforeEach(() => {
    // Create mock for repository
    mockSharedWorkoutRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByWorkoutId: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<SharedWorkoutRepository>;

    // Initialize use case with mocked repository
    deleteShareUseCase = new DeleteShareUseCase(mockSharedWorkoutRepository);
  });

  it('should delete a shared workout successfully', async () => {
    // Arrange
    const shareId = 'share-123';
    const workoutId = 'workout-123';
    
    const sharedWorkout: SharedWorkout = {
      id: shareId,
      workoutId: workoutId,
      link: 'http://localhost:3000/share/share-123',
      qrCode: 'data:image/png;base64,qrcode-data',
      createdAt: new Date()
    };

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(sharedWorkout);
    mockSharedWorkoutRepository.delete.mockResolvedValue();

    // Act
    const result = await deleteShareUseCase.execute(shareId);

    // Assert
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockSharedWorkoutRepository.delete).toHaveBeenCalledWith(shareId);
    expect(result).toBe(true);
  });

  it('should return false if the shared workout does not exist', async () => {
    // Arrange
    const shareId = 'non-existent-share';

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(null);

    // Act
    const result = await deleteShareUseCase.execute(shareId);

    // Assert
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockSharedWorkoutRepository.delete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    const shareId = 'share-123';
    mockSharedWorkoutRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(deleteShareUseCase.execute(shareId))
      .rejects
      .toThrow('Database error');
    
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockSharedWorkoutRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle delete operation error', async () => {
    // Arrange
    const shareId = 'share-123';
    const workoutId = 'workout-123';
    
    const sharedWorkout: SharedWorkout = {
      id: shareId,
      workoutId: workoutId,
      link: 'http://localhost:3000/share/share-123',
      qrCode: 'data:image/png;base64,qrcode-data',
      createdAt: new Date()
    };

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(sharedWorkout);
    mockSharedWorkoutRepository.delete.mockRejectedValue(new Error('Delete operation failed'));

    // Act & Assert
    await expect(deleteShareUseCase.execute(shareId))
      .rejects
      .toThrow('Delete operation failed');
    
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockSharedWorkoutRepository.delete).toHaveBeenCalledWith(shareId);
  });
}); 