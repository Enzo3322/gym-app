import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateExerciseUseCase } from '../../../../domain/use-cases/exercise/CreateExerciseUseCase';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Exercise } from '../../../../domain/entities/Exercise';

// Mock do UUID para tornar os testes determinísticos
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}));

describe('CreateExerciseUseCase', () => {
  let createExerciseUseCase: CreateExerciseUseCase;
  let mockExerciseRepository: jest.Mocked<ExerciseRepository>;

  beforeEach(() => {
    // Cria um mock do repositório
    mockExerciseRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<ExerciseRepository>;

    // Define os comportamentos padrão dos mocks
    mockExerciseRepository.create.mockResolvedValue({} as Exercise);
    mockExerciseRepository.findAll.mockResolvedValue([]);
    mockExerciseRepository.findById.mockResolvedValue(null);
    mockExerciseRepository.findByName.mockResolvedValue(null);
    mockExerciseRepository.update.mockResolvedValue({} as Exercise);
    mockExerciseRepository.delete.mockResolvedValue();

    // Inicializa o caso de uso com o repositório mockado
    createExerciseUseCase = new CreateExerciseUseCase(mockExerciseRepository);
  });

  it('should create a new exercise successfully', async () => {
    // Arrange
    const exerciseInput = {
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const expectedExercise: Exercise = {
      id: 'mocked-uuid',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    // Mock do método findByName para retornar null (exercício não existe)
    mockExerciseRepository.findByName.mockResolvedValue(null);
    
    // Mock do método create para retornar o exercício criado
    mockExerciseRepository.create.mockResolvedValue(expectedExercise);

    // Act
    const result = await createExerciseUseCase.execute(exerciseInput);

    // Assert
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Bench Press');
    expect(mockExerciseRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mocked-uuid',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    }));
    expect(result).toEqual(expectedExercise);
  });

  it('should create a new exercise without muscleGroup', async () => {
    // Arrange
    const exerciseInput = {
      name: 'Pull-up'
    };

    const expectedExercise: Exercise = {
      id: 'mocked-uuid',
      name: 'Pull-up'
    };

    mockExerciseRepository.findByName.mockResolvedValue(null);
    mockExerciseRepository.create.mockResolvedValue(expectedExercise);

    // Act
    const result = await createExerciseUseCase.execute(exerciseInput);

    // Assert
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Pull-up');
    expect(mockExerciseRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: 'mocked-uuid',
      name: 'Pull-up'
    }));
    expect(result).toEqual(expectedExercise);
  });

  it('should throw an error if exercise name is not provided', async () => {
    // Arrange
    const exerciseInput = {
      name: '',
      muscleGroup: 'Chest'
    };

    // Act & Assert
    await expect(createExerciseUseCase.execute(exerciseInput))
      .rejects
      .toThrow('Exercise name is required');
    
    expect(mockExerciseRepository.findByName).not.toHaveBeenCalled();
    expect(mockExerciseRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if exercise name is undefined', async () => {
    // Arrange
    const exerciseInput = {
      name: undefined as unknown as string,
      muscleGroup: 'Chest'
    };

    // Act & Assert
    await expect(createExerciseUseCase.execute(exerciseInput))
      .rejects
      .toThrow('Exercise name is required');
    
    expect(mockExerciseRepository.findByName).not.toHaveBeenCalled();
    expect(mockExerciseRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if exercise already exists', async () => {
    // Arrange
    const exerciseInput = {
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const existingExercise: Exercise = {
      id: 'existing-id',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    // Mock do método findByName para retornar um exercício existente
    mockExerciseRepository.findByName.mockResolvedValue(existingExercise);

    // Act & Assert
    await expect(createExerciseUseCase.execute(exerciseInput))
      .rejects
      .toThrow('Exercise already exists');
    
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Bench Press');
    expect(mockExerciseRepository.create).not.toHaveBeenCalled();
  });

  it('should handle repository error during creation', async () => {
    // Arrange
    const exerciseInput = {
      name: 'Squat',
      muscleGroup: 'Legs'
    };

    mockExerciseRepository.findByName.mockResolvedValue(null);
    mockExerciseRepository.create.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(createExerciseUseCase.execute(exerciseInput))
      .rejects
      .toThrow('Database error');
    
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Squat');
    expect(mockExerciseRepository.create).toHaveBeenCalled();
  });
  
  it('should handle repository error during findByName', async () => {
    // Arrange
    const exerciseInput = {
      name: 'Deadlift',
      muscleGroup: 'Back'
    };

    mockExerciseRepository.findByName.mockRejectedValue(new Error('Database lookup failed'));

    // Act & Assert
    await expect(createExerciseUseCase.execute(exerciseInput))
      .rejects
      .toThrow('Database lookup failed');
    
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Deadlift');
    expect(mockExerciseRepository.create).not.toHaveBeenCalled();
  });
}); 