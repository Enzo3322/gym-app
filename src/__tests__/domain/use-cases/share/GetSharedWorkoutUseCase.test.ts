import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GetSharedWorkoutUseCase, SharedWorkoutDetails } from '../../../../domain/use-cases/share/GetSharedWorkoutUseCase';
import { SharedWorkoutRepository } from '../../../../domain/ports/repositories/SharedWorkoutRepository';
import { WorkoutRepository } from '../../../../domain/ports/repositories/WorkoutRepository';
import { SharedWorkout } from '../../../../domain/entities/SharedWorkout';
import { Workout } from '../../../../domain/entities/Workout';

describe('GetSharedWorkoutUseCase', () => {
  let getSharedWorkoutUseCase: GetSharedWorkoutUseCase;
  let mockSharedWorkoutRepository: jest.Mocked<SharedWorkoutRepository>;
  let mockWorkoutRepository: jest.Mocked<WorkoutRepository>;

  beforeEach(() => {
    // Create mocks for repositories
    mockSharedWorkoutRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByWorkoutId: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<SharedWorkoutRepository>;

    mockWorkoutRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addExercise: jest.fn(),
      removeExercise: jest.fn(),
      getWorkoutExercises: jest.fn()
    } as jest.Mocked<WorkoutRepository>;

    // Initialize use case with mocked repositories
    getSharedWorkoutUseCase = new GetSharedWorkoutUseCase(
      mockSharedWorkoutRepository,
      mockWorkoutRepository
    );
  });

  it('should get a shared workout and its details successfully', async () => {
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
    
    const workout: Workout = {
      id: workoutId,
      name: 'Workout A',
      description: 'Test workout'
    };

    const expectedDetails: SharedWorkoutDetails = {
      share: sharedWorkout,
      workout: workout
    };

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(sharedWorkout);
    mockWorkoutRepository.findById.mockResolvedValue(workout);

    // Act
    const result = await getSharedWorkoutUseCase.execute(shareId);

    // Assert
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(result).toEqual(expectedDetails);
  });

  it('should return null if the shared workout does not exist', async () => {
    // Arrange
    const shareId = 'non-existent-share';

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(null);

    // Act
    const result = await getSharedWorkoutUseCase.execute(shareId);

    // Assert
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockWorkoutRepository.findById).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if the workout associated with the share does not exist', async () => {
    // Arrange
    const shareId = 'share-123';
    const workoutId = 'non-existent-workout';
    
    const sharedWorkout: SharedWorkout = {
      id: shareId,
      workoutId: workoutId,
      link: 'http://localhost:3000/share/share-123',
      qrCode: 'data:image/png;base64,qrcode-data',
      createdAt: new Date()
    };

    // Mock repository responses
    mockSharedWorkoutRepository.findById.mockResolvedValue(sharedWorkout);
    mockWorkoutRepository.findById.mockResolvedValue(null);

    // Act
    const result = await getSharedWorkoutUseCase.execute(shareId);

    // Assert
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(result).toBeNull();
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    const shareId = 'share-123';
    mockSharedWorkoutRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(getSharedWorkoutUseCase.execute(shareId))
      .rejects
      .toThrow('Database error');
    
    expect(mockSharedWorkoutRepository.findById).toHaveBeenCalledWith(shareId);
  });
}); 