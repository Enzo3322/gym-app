import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../gesture-handler.native';

import { useColorScheme } from '@/hooks/useColorScheme';
import NotFound from './+not-found';
import ExercisesScreen from './exercises';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutsScreen from './workouts';
import SharedWorkoutScreen from './shared';
import HomeScreen from './home';

// Prevent the splash screen from auto-hiding before asset loading is complete.
const Drawer = createDrawerNavigator();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} 
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
        name="workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="exercises"
        component={ExercisesScreen}
        options={{
          title: 'Exercises',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="shared"
        component={SharedWorkoutScreen}
        options={{
          title: 'Shared',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="share" size={size} color={color} />
          ),
        }}
      />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
