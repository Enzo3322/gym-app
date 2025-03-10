import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Workout } from '../../types/api';
import { workoutApi, shareApi } from '../../services/api';
import { theme } from '../../config/env';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWorkout();
  }, [id]);

  async function loadWorkout() {
    try {
      const data = await workoutApi.getById(id as string);
      setWorkout(data);
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Could not load workout details');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    try {
      const shared = await shareApi.shareWorkout(id as string);
      await Share.share({
        message: `Check out this workout: ${shared.link}`,
      });
    } catch (error) {
      console.error('Error sharing workout:', error);
      Alert.alert('Error', 'Could not share workout');
    }
  }

  async function handleDelete() {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutApi.delete(id as string);
              router.back();
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Could not delete workout');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.name}</Text>
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <MaterialIcons
            name="share"
            size={24}
            color={theme.colors.primary}
            onPress={handleShare}
            style={styles.actionIcon}
          />
          <MaterialIcons
            name="edit"
            size={24}
            color={theme.colors.primary}
            onPress={() => router.push(`/workouts/${id}/edit`)}
            style={styles.actionIcon}
          />
          <MaterialIcons
            name="delete"
            size={24}
            color={theme.colors.error}
            onPress={handleDelete}
            style={styles.actionIcon}
          />
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            showDetails
          />
        ))}
      </ScrollView>

      <MaterialIcons
        name="add-circle"
        size={56}
        color={theme.colors.primary}
        style={styles.fab}
        onPress={() => router.push(`/workouts/${id}/add-exercise`)}
      />
    </View>
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  actionIcon: {
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
}); 