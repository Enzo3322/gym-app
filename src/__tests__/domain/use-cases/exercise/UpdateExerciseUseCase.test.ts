import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { UpdateExerciseUseCase } from '../../../../domain/use-cases/exercise/UpdateExerciseUseCase';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Exercise } from '../../../../domain/entities/Exercise';

describe('UpdateExerciseUseCase', () => {
  let updateExerciseUseCase: UpdateExerciseUseCase;
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
    mockExerciseRepository.findById.mockResolvedValue(null);
    mockExerciseRepository.findByName.mockResolvedValue(null);
    mockExerciseRepository.update.mockImplementation(exercise => Promise.resolve(exercise));

    // Inicializa o caso de uso com o repositório mockado
    updateExerciseUseCase = new UpdateExerciseUseCase(mockExerciseRepository);
  });

  it('should update an exercise successfully', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'Incline Bench Press',
      muscleGroup: 'Upper Chest'
    };

    const expectedUpdatedExercise: Exercise = {
      id: 'exercise-123',
      name: 'Incline Bench Press',
      muscleGroup: 'Upper Chest'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockResolvedValue(expectedUpdatedExercise);

    // Act
    const result = await updateExerciseUseCase.execute(updateInput);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Incline Bench Press');
    expect(mockExerciseRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 'exercise-123',
      name: 'Incline Bench Press',
      muscleGroup: 'Upper Chest'
    }));
    expect(result).toEqual(expectedUpdatedExercise);
  });

  it('should update only the name of an exercise', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'Flat Bench Press'
    };

    const expectedUpdatedExercise: Exercise = {
      id: 'exercise-123',
      name: 'Flat Bench Press',
      muscleGroup: 'Chest'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockResolvedValue(expectedUpdatedExercise);

    // Act
    const result = await updateExerciseUseCase.execute(updateInput);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Flat Bench Press');
    expect(mockExerciseRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 'exercise-123',
      name: 'Flat Bench Press',
      muscleGroup: 'Chest'
    }));
    expect(result).toEqual(expectedUpdatedExercise);
  });

  it('should update only the muscleGroup of an exercise', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      muscleGroup: 'Upper Body'
    };

    const expectedUpdatedExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Upper Body'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockResolvedValue(expectedUpdatedExercise);

    // Act
    const result = await updateExerciseUseCase.execute(updateInput);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).not.toHaveBeenCalled();
    expect(mockExerciseRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Upper Body'
    }));
    expect(result).toEqual(expectedUpdatedExercise);
  });

  it('should set muscleGroup to empty string when provided', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      muscleGroup: ''  // Empty string, not undefined
    };

    const expectedUpdatedExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: ''
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockResolvedValue(expectedUpdatedExercise);

    // Act
    const result = await updateExerciseUseCase.execute(updateInput);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: ''
    }));
    expect(result).toEqual(expectedUpdatedExercise);
  });

  it('should throw an error if exercise is not found', async () => {
    // Arrange
    const updateInput = {
      id: 'non-existent-id',
      name: 'New Exercise Name'
    };

    mockExerciseRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateExerciseUseCase.execute(updateInput))
      .rejects
      .toThrow('Exercise not found');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockExerciseRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the new name already exists for another exercise', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const anotherExercise: Exercise = {
      id: 'exercise-456',
      name: 'Incline Bench Press',
      muscleGroup: 'Upper Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'Incline Bench Press'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.findByName.mockResolvedValue(anotherExercise);

    // Act & Assert
    await expect(updateExerciseUseCase.execute(updateInput))
      .rejects
      .toThrow('Exercise name already exists');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('Incline Bench Press');
    expect(mockExerciseRepository.update).not.toHaveBeenCalled();
  });

  it('should allow updating with the same name as the current exercise', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Upper Body'
    };

    const expectedUpdatedExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Upper Body'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockResolvedValue(expectedUpdatedExercise);

    // Act
    const result = await updateExerciseUseCase.execute(updateInput);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).not.toHaveBeenCalled();
    expect(mockExerciseRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Upper Body'
    }));
    expect(result).toEqual(expectedUpdatedExercise);
  });

  it('should handle repository error during findById', async () => {
    // Arrange
    const updateInput = {
      id: 'exercise-123',
      name: 'New Name'
    };

    mockExerciseRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(updateExerciseUseCase.execute(updateInput))
      .rejects
      .toThrow('Database error');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.update).not.toHaveBeenCalled();
  });

  it('should handle repository error during findByName', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'New Name'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.findByName.mockRejectedValue(new Error('Database error during name check'));

    // Act & Assert
    await expect(updateExerciseUseCase.execute(updateInput))
      .rejects
      .toThrow('Database error during name check');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('New Name');
    expect(mockExerciseRepository.update).not.toHaveBeenCalled();
  });

  it('should handle repository error during update', async () => {
    // Arrange
    const existingExercise: Exercise = {
      id: 'exercise-123',
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const updateInput = {
      id: 'exercise-123',
      name: 'New Name'
    };

    mockExerciseRepository.findById.mockResolvedValue(existingExercise);
    mockExerciseRepository.update.mockRejectedValue(new Error('Update failed'));

    // Act & Assert
    await expect(updateExerciseUseCase.execute(updateInput))
      .rejects
      .toThrow('Update failed');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith('exercise-123');
    expect(mockExerciseRepository.findByName).toHaveBeenCalledWith('New Name');
    expect(mockExerciseRepository.update).toHaveBeenCalled();
  });
}); 