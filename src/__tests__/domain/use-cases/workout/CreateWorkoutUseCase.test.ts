import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateWorkoutUseCase } from '../../../../domain/use-cases/workout/CreateWorkoutUseCase';
import { WorkoutRepository } from '../../../../domain/ports/repositories/WorkoutRepository';
import { Workout } from '../../../../domain/entities/Workout';

// Mock do UUID para tornar os testes determinísticos
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}));

describe('CreateWorkoutUseCase', () => {
  let createWorkoutUseCase: CreateWorkoutUseCase;
  let mockWorkoutRepository: jest.Mocked<WorkoutRepository>;

  beforeEach(() => {
    // Cria um mock do repositório
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

    // Define os comportamentos padrão dos mocks
    mockWorkoutRepository.create.mockResolvedValue({} as Workout);
    mockWorkoutRepository.findAll.mockResolvedValue([]);
    mockWorkoutRepository.findById.mockResolvedValue(null);
    mockWorkoutRepository.update.mockResolvedValue({} as Workout);
    mockWorkoutRepository.delete.mockResolvedValue();
    mockWorkoutRepository.addExercise.mockResolvedValue();
    mockWorkoutRepository.removeExercise.mockResolvedValue();
    mockWorkoutRepository.getWorkoutExercises.mockResolvedValue([]);

    // Inicializa o caso de uso com o repositório mockado
    createWorkoutUseCase = new CreateWorkoutUseCase(mockWorkoutRepository);
  });

  it('should create a new workout successfully', async () => {
    // Arrange
    const workoutInput = {
      name: 'Upper Body Day',
      description: 'Focus on chest, shoulders and back'
    };

    const expectedWorkout: Workout = {
      id: 'mocked-uuid',
      name: 'Upper Body Day',
      description: 'Focus on chest, shoulders and back',
      exercises: []
    };

    mockWorkoutRepository.create.mockResolvedValue(expectedWorkout);

    // Act
    const result = await createWorkoutUseCase.execute(workoutInput);

    // Assert
    expect(mockWorkoutRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mocked-uuid',
      name: 'Upper Body Day',
      description: 'Focus on chest, shoulders and back'
    }));
    expect(result).toEqual(expectedWorkout);
  });

  it('should create a workout without description', async () => {
    // Arrange
    const workoutInput = {
      name: 'Lower Body Day'
    };

    const expectedWorkout: Workout = {
      id: 'mocked-uuid',
      name: 'Lower Body Day',
      exercises: []
    };

    mockWorkoutRepository.create.mockResolvedValue(expectedWorkout);

    // Act
    const result = await createWorkoutUseCase.execute(workoutInput);

    // Assert
    expect(mockWorkoutRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mocked-uuid',
      name: 'Lower Body Day'
    }));
    expect(result).toEqual(expectedWorkout);
  });

  it('should throw an error if workout name is not provided', async () => {
    // Arrange
    const workoutInput = {
      name: '',
      description: 'Some description'
    };

    // Act & Assert
    await expect(createWorkoutUseCase.execute(workoutInput))
      .rejects
      .toThrow('Workout name is required');
    
    expect(mockWorkoutRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if workout name is undefined', async () => {
    // Arrange
    const workoutInput = {
      name: undefined as unknown as string,
      description: 'Some description'
    };

    // Act & Assert
    await expect(createWorkoutUseCase.execute(workoutInput))
      .rejects
      .toThrow('Workout name is required');
    
    expect(mockWorkoutRepository.create).not.toHaveBeenCalled();
  });

  it('should handle repository error during creation', async () => {
    // Arrange
    const workoutInput = {
      name: 'Full Body Workout',
      description: 'Complete body workout'
    };

    mockWorkoutRepository.create.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(createWorkoutUseCase.execute(workoutInput))
      .rejects
      .toThrow('Database error');
    
    expect(mockWorkoutRepository.create).toHaveBeenCalled();
  });
}); 