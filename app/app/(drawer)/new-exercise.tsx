import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/config/env';
import { ExerciseForm } from '@/components/ExerciseForm';
import { exerciseApi } from '@/services/api';

export default function AddExerciseScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      await exerciseApi.create(data);
      router.push('/exercises');
    } catch (error) {
      console.error('Error creating exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ExerciseForm onSubmit={handleSubmit} loading={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
}); 