import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { GetExerciseUseCase } from '../../../../domain/use-cases/exercise/GetExerciseUseCase';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Exercise } from '../../../../domain/entities/Exercise';

describe('GetExerciseUseCase', () => {
  let getExerciseUseCase: GetExerciseUseCase;
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

    // Inicializa o caso de uso com o repositório mockado
    getExerciseUseCase = new GetExerciseUseCase(mockExerciseRepository);
  });

  it('should get an exercise by id successfully', async () => {
    // Arrange
    const exerciseId = 'exercise-123';
    const expectedExercise: Exercise = {
      id: exerciseId,
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    mockExerciseRepository.findById.mockResolvedValue(expectedExercise);

    // Act
    const result = await getExerciseUseCase.execute(exerciseId);

    // Assert
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(result).toEqual(expectedExercise);
  });

  it('should throw an error if exercise is not found', async () => {
    // Arrange
    const exerciseId = 'non-existent-id';
    mockExerciseRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getExerciseUseCase.execute(exerciseId))
      .rejects
      .toThrow('Exercise not found');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
  });

  it('should handle repository error', async () => {
    // Arrange
    const exerciseId = 'exercise-123';
    mockExerciseRepository.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(getExerciseUseCase.execute(exerciseId))
      .rejects
      .toThrow('Database error');
    
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
  });
}); 