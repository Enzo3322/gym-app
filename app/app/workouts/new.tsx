import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/Button';
import { workoutApi } from '../../services/api';
import { Colors } from '../../constants/Colors';

export default function NewWorkoutScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Error', 'Workout name is required');
      return;
    }

    setLoading(true);
    try {
      const workout = await workoutApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      router.replace(`/workouts/${workout.id}`);
    } catch (error) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', 'Could not create workout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={Colors.light.text}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor={Colors.light.text}
      />
      <Button
        title="Create Workout"
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
    backgroundColor: Colors.light.background,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: Colors.light.text,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 