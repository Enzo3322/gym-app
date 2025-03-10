import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Exercise } from '../../../types/api';
import { exerciseApi, workoutApi } from '../../../services/api';
import { ExerciseCard } from '../../../components/ExerciseCard';
import { Button } from '../../../components/Button';
import { theme } from '../../../config/env';

export default function AddExerciseScreen() {
  const { id } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [reps, setReps] = useState('');
  const [interval, setInterval] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    try {
      const data = await exerciseApi.getAll();
      setExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('Error', 'Could not load exercises');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!selectedExercise) {
      Alert.alert('Error', 'Please select an exercise');
      return;
    }

    if (!reps || parseInt(reps) <= 0) {
      Alert.alert('Error', 'Please enter a valid number of reps');
      return;
    }

    if (!interval || parseInt(interval) < 0) {
      Alert.alert('Error', 'Please enter a valid interval');
      return;
    }

    setLoading(true);
    try {
      await workoutApi.addExercise(id as string, {
        exerciseId: selectedExercise.id,
        reps: parseInt(reps),
        interval: parseInt(interval),
      });
      router.back();
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'Could not add exercise to workout');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={() => setSelectedExercise(item)}
          />
        )}
        contentContainerStyle={styles.list}
      />

      {selectedExercise && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Number of reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            placeholderTextColor={theme.colors.text}
          />
          <TextInput
            style={styles.input}
            placeholder="Rest interval (seconds)"
            value={interval}
            onChangeText={setInterval}
            keyboardType="number-pad"
            placeholderTextColor={theme.colors.text}
          />
          <Button
            title="Add to Workout"
            onPress={handleAdd}
            loading={loading}
          />
        </View>
      )}
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
  list: {
    padding: 16,
  },
  form: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: theme.colors.text,
    fontSize: 16,
  },
}); 