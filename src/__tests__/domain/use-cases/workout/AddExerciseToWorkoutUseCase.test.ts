import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AddExerciseToWorkoutUseCase } from '../../../../domain/use-cases/workout/AddExerciseToWorkoutUseCase';
import { WorkoutRepository } from '../../../../domain/ports/repositories/WorkoutRepository';
import { ExerciseRepository } from '../../../../domain/ports/repositories/ExerciseRepository';
import { Workout, WorkoutExercise } from '../../../../domain/entities/Workout';
import { Exercise } from '../../../../domain/entities/Exercise';

describe('AddExerciseToWorkoutUseCase', () => {
  let addExerciseToWorkoutUseCase: AddExerciseToWorkoutUseCase;
  let mockWorkoutRepository: jest.Mocked<WorkoutRepository>;
  let mockExerciseRepository: jest.Mocked<ExerciseRepository>;

  beforeEach(() => {
    // Cria mocks dos repositórios
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

    mockExerciseRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<ExerciseRepository>;

    // Define os comportamentos padrão dos mocks
    mockWorkoutRepository.findById.mockResolvedValue(null);
    mockExerciseRepository.findById.mockResolvedValue(null);
    mockWorkoutRepository.addExercise.mockResolvedValue();

    // Inicializa o caso de uso com os repositórios mockados
    addExerciseToWorkoutUseCase = new AddExerciseToWorkoutUseCase(
      mockWorkoutRepository,
      mockExerciseRepository
    );
  });

  it('should add an exercise to a workout successfully', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'exercise-456';
    
    const mockWorkout: Workout = {
      id: workoutId,
      name: 'Upper Body Workout',
      description: 'Chest and back',
      exercises: []
    };

    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Bench Press',
      muscleGroup: 'Chest'
    };

    const input = {
      workoutId,
      exerciseId,
      reps: 12,
      interval: 60
    };

    const expectedWorkoutExercise: WorkoutExercise = {
      exerciseId,
      reps: 12,
      interval: 60
    };

    mockWorkoutRepository.findById.mockResolvedValue(mockWorkout);
    mockExerciseRepository.findById.mockResolvedValue(mockExercise);

    // Act
    await addExerciseToWorkoutUseCase.execute(input);

    // Assert
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockWorkoutRepository.addExercise).toHaveBeenCalledWith(
      workoutId,
      expectedWorkoutExercise
    );
  });

  it('should add an exercise without reps and interval', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'exercise-456';
    
    const mockWorkout: Workout = {
      id: workoutId,
      name: 'Upper Body Workout',
      exercises: []
    };

    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Pull-ups'
    };

    const input = {
      workoutId,
      exerciseId
    };

    const expectedWorkoutExercise: WorkoutExercise = {
      exerciseId
    };

    mockWorkoutRepository.findById.mockResolvedValue(mockWorkout);
    mockExerciseRepository.findById.mockResolvedValue(mockExercise);

    // Act
    await addExerciseToWorkoutUseCase.execute(input);

    // Assert
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockWorkoutRepository.addExercise).toHaveBeenCalledWith(
      workoutId,
      expectedWorkoutExercise
    );
  });

  it('should throw an error if workout is not found', async () => {
    // Arrange
    const workoutId = 'non-existent-workout';
    const exerciseId = 'exercise-456';
    
    mockWorkoutRepository.findById.mockResolvedValue(null);
    
    const input = {
      workoutId,
      exerciseId,
      reps: 10,
      interval: 45
    };

    // Act & Assert
    await expect(addExerciseToWorkoutUseCase.execute(input))
      .rejects
      .toThrow('Workout not found');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).not.toHaveBeenCalled();
    expect(mockWorkoutRepository.addExercise).not.toHaveBeenCalled();
  });

  it('should throw an error if exercise is not found', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'non-existent-exercise';
    
    const mockWorkout: Workout = {
      id: workoutId,
      name: 'Lower Body Workout',
      exercises: []
    };

    mockWorkoutRepository.findById.mockResolvedValue(mockWorkout);
    mockExerciseRepository.findById.mockResolvedValue(null);
    
    const input = {
      workoutId,
      exerciseId,
      reps: 10,
      interval: 45
    };

    // Act & Assert
    await expect(addExerciseToWorkoutUseCase.execute(input))
      .rejects
      .toThrow('Exercise not found');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockWorkoutRepository.addExercise).not.toHaveBeenCalled();
  });

  it('should handle repository error during findById workout', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'exercise-456';
    
    mockWorkoutRepository.findById.mockRejectedValue(new Error('Database error'));
    
    const input = {
      workoutId,
      exerciseId,
      reps: 10,
      interval: 45
    };

    // Act & Assert
    await expect(addExerciseToWorkoutUseCase.execute(input))
      .rejects
      .toThrow('Database error');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).not.toHaveBeenCalled();
    expect(mockWorkoutRepository.addExercise).not.toHaveBeenCalled();
  });

  it('should handle repository error during findById exercise', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'exercise-456';
    
    const mockWorkout: Workout = {
      id: workoutId,
      name: 'Full Body Workout',
      exercises: []
    };

    mockWorkoutRepository.findById.mockResolvedValue(mockWorkout);
    mockExerciseRepository.findById.mockRejectedValue(new Error('Exercise database error'));
    
    const input = {
      workoutId,
      exerciseId,
      reps: 10,
      interval: 45
    };

    // Act & Assert
    await expect(addExerciseToWorkoutUseCase.execute(input))
      .rejects
      .toThrow('Exercise database error');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockWorkoutRepository.addExercise).not.toHaveBeenCalled();
  });

  it('should handle repository error during addExercise', async () => {
    // Arrange
    const workoutId = 'workout-123';
    const exerciseId = 'exercise-456';
    
    const mockWorkout: Workout = {
      id: workoutId,
      name: 'Cardio Workout',
      exercises: []
    };

    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Treadmill',
      muscleGroup: 'Cardio'
    };

    mockWorkoutRepository.findById.mockResolvedValue(mockWorkout);
    mockExerciseRepository.findById.mockResolvedValue(mockExercise);
    mockWorkoutRepository.addExercise.mockRejectedValue(new Error('Failed to add exercise'));
    
    const input = {
      workoutId,
      exerciseId,
      reps: 1,
      interval: 300
    };

    // Act & Assert
    await expect(addExerciseToWorkoutUseCase.execute(input))
      .rejects
      .toThrow('Failed to add exercise');
    
    expect(mockWorkoutRepository.findById).toHaveBeenCalledWith(workoutId);
    expect(mockExerciseRepository.findById).toHaveBeenCalledWith(exerciseId);
    expect(mockWorkoutRepository.addExercise).toHaveBeenCalled();
  });
}); 