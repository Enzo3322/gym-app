import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/Button';
import { exerciseApi } from '../../services/api';
import { theme } from '../../config/env';

export default function NewExerciseScreen() {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Error', 'Exercise name is required');
      return;
    }

    setLoading(true);
    try {
      const exercise = await exerciseApi.create({
        name: name.trim(),
        muscleGroup: muscleGroup.trim() || undefined,
      });
      router.replace(`/exercises/${exercise.id}`);
    } catch (error) {
      console.error('Error creating exercise:', error);
      Alert.alert('Error', 'Could not create exercise');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.text}
      />
      <TextInput
        style={styles.input}
        placeholder="Muscle Group (optional)"
        value={muscleGroup}
        onChangeText={setMuscleGroup}
        placeholderTextColor={theme.colors.text}
      />
      <Button
        title="Create Exercise"
        onPress={handleCreate}
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