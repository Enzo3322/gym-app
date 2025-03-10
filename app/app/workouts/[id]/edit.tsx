import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Workout } from '../../../types/api';
import { workoutApi } from '../../../services/api';
import { Button } from '../../../components/Button';
import { theme } from '../../../config/env';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWorkout();
  }, [id]);

  async function loadWorkout() {
    try {
      const data = await workoutApi.getById(id as string);
      setWorkout(data);
      setName(data.name);
      setDescription(data.description || '');
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Could not load workout details');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!name.trim()) {
      Alert.alert('Error', 'Workout name is required');
      return;
    }

    setLoading(true);
    try {
      await workoutApi.update(id as string, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      router.back();
    } catch (error) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', 'Could not update workout');
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

  if (!workout) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.text}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor={theme.colors.text}
      />
      <Button
        title="Update Workout"
        onPress={handleUpdate}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 