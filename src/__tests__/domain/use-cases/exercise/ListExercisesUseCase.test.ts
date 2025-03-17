import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ListExercisesUseCase } from '../../../../domain/use-cases/exercise/ListExercisesUseCase';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Exercise } from '../../../../domain/entities/Exercise';

describe('ListExercisesUseCase', () => {
  let listExercisesUseCase: ListExercisesUseCase;
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
    mockExerciseRepository.findAll.mockResolvedValue([]);

    // Inicializa o caso de uso com o repositório mockado
    listExercisesUseCase = new ListExercisesUseCase(mockExerciseRepository);
  });

  it('should list all exercises successfully', async () => {
    // Arrange
    const mockExercises: Exercise[] = [
      {
        id: 'exercise-123',
        name: 'Bench Press',
        muscleGroup: 'Chest'
      },
      {
        id: 'exercise-456',
        name: 'Squat',
        muscleGroup: 'Legs'
      },
      {
        id: 'exercise-789',
        name: 'Deadlift',
        muscleGroup: 'Back'
      }
    ];

    mockExerciseRepository.findAll.mockResolvedValue(mockExercises);

    // Act
    const result = await listExercisesUseCase.execute();

    // Assert
    expect(mockExerciseRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockExercises);
    expect(result.length).toBe(3);
  });

  it('should return an empty array when no exercises exist', async () => {
    // Arrange
    mockExerciseRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await listExercisesUseCase.execute();

    // Assert
    expect(mockExerciseRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should handle repository error', async () => {
    // Arrange
    mockExerciseRepository.findAll.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(listExercisesUseCase.execute())
      .rejects
      .toThrow('Database error');
    
    expect(mockExerciseRepository.findAll).toHaveBeenCalled();
  });
}); 