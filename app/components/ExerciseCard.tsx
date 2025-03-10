import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Exercise, WorkoutExercise } from '../types/api';
import { theme } from '../config/env';

interface ExerciseCardProps {
  exercise: Exercise | WorkoutExercise;
  onPress?: () => void;
  showDetails?: boolean;
}

export function ExerciseCard({ exercise, onPress, showDetails }: ExerciseCardProps) {
  const isWorkoutExercise = 'reps' in exercise;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        {exercise.muscleGroup && (
          <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
        )}
        {isWorkoutExercise && showDetails && (
          <View style={styles.details}>
            <Text style={styles.detailText}>
              Reps: {(exercise as WorkoutExercise).reps}
            </Text>
            <Text style={styles.detailText}>
              Interval: {(exercise as WorkoutExercise).interval}s
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  muscleGroup: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
  details: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
  },
}); 