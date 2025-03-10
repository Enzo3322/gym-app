import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { SharedWorkout } from '../../types/api';
import { ExerciseCard } from '../../components/ExerciseCard';
import { theme } from '../../config/env';

export default function SharedWorkoutScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const sharedWorkout: SharedWorkout | null = data ? JSON.parse(data) : null;

  if (!sharedWorkout) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No shared workout found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{sharedWorkout.workout_name}</Text>
        {sharedWorkout.workout_description && (
          <Text style={styles.description}>
            {sharedWorkout.workout_description}
          </Text>
        )}
      </View>

      <View style={styles.qrContainer}>
        <QRCode
          value={sharedWorkout.link}
          size={200}
          color={theme.colors.text}
          backgroundColor={theme.colors.background}
          onPress={() => Linking.openURL(sharedWorkout.link)}
        />
      </View>

      <Text style={styles.sectionTitle}>Exercises</Text>
      {sharedWorkout.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          showDetails
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
}); 