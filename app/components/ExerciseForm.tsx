import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { theme } from '@/config/env';

interface ExerciseFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: {
    name: string;
    description: string;
    videoUrl?: string;
  };
}

export function ExerciseForm({ onSubmit, loading, initialData }: ExerciseFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');

  const handleSubmit = () => {
    onSubmit({
      name,
      description,
      videoUrl: videoUrl.trim() || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <TextInput
        label="Video URL (optional)"
        value={videoUrl}
        onChangeText={setVideoUrl}
        mode="outlined"
        style={styles.input}
        keyboardType="url"
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !name.trim()}
        style={styles.button}
      >
        Save Exercise
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  button: {
    marginTop: 8,
  },
}); 