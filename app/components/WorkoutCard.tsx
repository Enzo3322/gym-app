import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Workout } from '../types/api';
import { theme } from '../config/env';

interface WorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{workout.name}</Text>
        {workout.description && (
          <Text style={styles.description}>{workout.description}</Text>
        )}
        <Text style={styles.exerciseCount}>
          {workout?.exercises?.length} exercises
        </Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  exerciseCount: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 8,
  },
}); 