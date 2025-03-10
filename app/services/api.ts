import axios from 'axios';
import { API_URL } from '../config/env';
import { 
  Exercise, 
  Workout, 
  SharedWorkout, 
  CreateExerciseData, 
  CreateWorkoutData,
  AddExerciseToWorkoutData 
} from '../types/api';

const api = axios.create({
  baseURL: API_URL,
});

// Exercise endpoints
export const exerciseApi = {
  create: async (data: CreateExerciseData) => {
    const response = await api.post<Exercise>('/exercises', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Exercise[]>('/exercises');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },

  update: async (id: string, data: CreateExerciseData) => {
    const response = await api.put<Exercise>(`/exercises/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/exercises/${id}`);
  },
};

// Workout endpoints
export const workoutApi = {
  create: async (data: CreateWorkoutData) => {
    const response = await api.post<Workout>('/workouts', data);
    return response.data;
  },

  addExercise: async (workoutId: string, data: AddExerciseToWorkoutData) => {
    const response = await api.post<Workout>(`/workouts/${workoutId}/exercises`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Workout[]>('/workouts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Workout>(`/workouts/${id}`);
    return response.data;
  },

  update: async (id: string, data: CreateWorkoutData) => {
    const response = await api.put<Workout>(`/workouts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/workouts/${id}`);
  },
};

// Share endpoints
export const shareApi = {
  shareWorkout: async (workoutId: string) => {
    const response = await api.post<SharedWorkout>(`/share/workouts/${workoutId}`);
    return response.data;
  },

  getSharedWorkout: async (shareId: string) => {
    const response = await api.get<SharedWorkout>(`/share/${shareId}`);
    return response.data;
  },

  deleteShare: async (shareId: string) => {
    await api.delete(`/share/${shareId}`);
  },
}; 