import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DeleteExerciseUseCase } from '../../../../domain/use-cases/exercise/DeleteExerciseUseCase';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Exercise } from '../../../../domain/entities/Exercise';

describe('DeleteExerciseUseCase', () => {
  let deleteExerciseUseCase: DeleteExerciseUseCase;
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
    mockExerciseRepository.delete.mockResolvedValue();

    // Inicializa o caso de uso com o repositório mockado
    deleteExerciseUseCase = new DeleteExerciseUseCase(mockExerciseRepository);
  });

  it('should delete an exercise successfully', async () => {
    // Arrange
    const exerciseId = 'exercise-123';
    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    mockExerciseRepository.findById.mockResolvedValue(mockExercise);

    // Act
    await deleteExerciseUseCase.execute(exerciseId);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockExerciseRepository.delete).toHaveBeenCalledWith(exerciseId);
  });

  it('should throw an error if exercise is not found', async () => {
    // Arrange
    const exerciseId = 'non-existent-id';
    mockExerciseRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(deleteExerciseUseCase.execute(exerciseId))
      .rejects
      .toThrow('Exercise not found');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockExerciseRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle repository error during findById', async () => {
    // Arrange
    const exerciseId = 'exercise-123';
    mockExerciseRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(deleteExerciseUseCase.execute(exerciseId))
      .rejects
      .toThrow('Database error');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockExerciseRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle repository error during delete', async () => {
    // Arrange
    const exerciseId = 'exercise-123';
    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    mockExerciseRepository.findById.mockResolvedValue(mockExercise);
    mockExerciseRepository.delete.mockRejectedValue(new Error('Delete failed'));

    // Act & Assert
    await expect(deleteExerciseUseCase.execute(exerciseId))
      .rejects
      .toThrow('Delete failed');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockExerciseRepository.delete).toHaveBeenCalledWith(exerciseId);
  });
}); 