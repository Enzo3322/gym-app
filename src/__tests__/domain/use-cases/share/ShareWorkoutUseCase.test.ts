import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ShareWorkoutUseCase } from '../../../../domain/use-cases/share/ShareWorkoutUseCase';
import { SharedWorkoutRepository } from '../../../../domain/ports/repositories/SharedWorkoutRepository';
import { WorkoutRepository } from '../../../../domain/ports/repositories/WorkoutRepository';
import { SharedWorkout } from '../../../../domain/entities/SharedWorkout';
import { Workout } from '../../../../domain/entities/Workout';

// Mock QRCode module
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockImplementation(() => Promise.resolve('mocked-qr-code-data-url'))
}));

describe('ShareWorkoutUseCase', () => {
  let shareWorkoutUseCase: ShareWorkoutUseCase;
  let mockSharedWorkoutRepository: jest.Mocked<SharedWorkoutRepository>;
  let mockWorkoutRepository: jest.Mocked<WorkoutRepository>;
  const baseUrl = 'http://localhost:3000';

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
    shareWorkoutUseCase = new ShareWorkoutUseCase(
      mockSharedWorkoutRepository,
      mockWorkoutRepository,
      baseUrl
    );
  });

  it('should share a workout successfully if it exists and has not been shared before', async () => {
    // Arrange
    const workoutId = 'workout-123';
    
    const workout: Workout = {
      id: workoutId,
      name: 'Workout A',
      description: 'Test workout'
    };

    // Mock repository responses
    mockWorkoutRepository.findById.mockResolvedValue(workout);
    mockSharedWorkoutRepository.findByWorkoutId.mockResolvedValue([]);
    mockSharedWorkoutRepository.create.mockImplementation(async (sharedWorkout) => sharedWorkout);

    // Act
    const result = await shareWorkoutUseCase.execute(workoutId);

    // Assert
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockSharedWorkoutRepository.findByWorkoutId).toHaveBeenCalledWith(workoutId);
    expect(mockSharedWorkoutRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      workoutId: workoutId,
      link: expect.stringContaining(`${baseUrl}/share/`),
      qrCode: 'mocked-qr-code-data-url'
    }));
    
    expect(result).toEqual(expect.objectContaining({
      workoutId: workoutId,
      link: expect.stringContaining(`${baseUrl}/share/`),
      qrCode: 'mocked-qr-code-data-url'
    }));
  });

  it('should return existing shared workout if the workout has been shared before', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const existingShareId = 'existing-share-123';
    
    const workout: Workout = {
      id: workoutId,
      name: 'Workout A',
      description: 'Test workout'
    };

    const existingSharedWorkout: SharedWorkout = {
      id: existingShareId,
      workoutId: workoutId,
      link: `${baseUrl}/share/${existingShareId}`,
      qrCode: 'existing-qr-code',
      createdAt: new Date()
    };

    // Mock repository responses
    mockWorkoutRepository.findById.mockResolvedValue(workout);
    mockSharedWorkoutRepository.findByWorkoutId.mockResolvedValue([existingSharedWorkout]);

    // Act
    const result = await shareWorkoutUseCase.execute(workoutId);

    // Assert
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockSharedWorkoutRepository.findByWorkoutId).toHaveBeenCalledWith(workoutId);
    expect(mockSharedWorkoutRepository.create).not.toHaveBeenCalled();
    expect(result).toEqual(existingSharedWorkout);
  });

  it('should return null if the workout does not exist', async () => {
    // Arrange
    const workoutId = 'non-existent-workout';

    // Mock repository responses
    mockWorkoutRepository.findById.mockResolvedValue(null);

    // Act
    const result = await shareWorkoutUseCase.execute(workoutId);

    // Assert
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockSharedWorkoutRepository.findByWorkoutId).not.toHaveBeenCalled();
    expect(mockSharedWorkoutRepository.create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    const workoutId = 'workout-123';
    mockWorkoutRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(shareWorkoutUseCase.execute(workoutId))
      .rejects
      .toThrow('Database error');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
  });
}); 