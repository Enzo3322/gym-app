import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../config/env';

interface DrawerItemProps {
  label: string;
  icon: string;
  onPress: () => void;
  isActive?: boolean;
  indent?: boolean;
}

function DrawerItem({ label, icon, onPress, isActive, indent }: DrawerItemProps) {
  return (
    <Pressable
      style={[
        styles.drawerItem,
        isActive && styles.activeItem,
        indent && styles.indentedItem,
      ]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={isActive ? theme.colors.primary : theme.colors.text}
      />
      <Text
        style={[
          styles.drawerLabel,
          isActive && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface DrawerGroupProps {
  label: string;
  icon: string;
  children: React.ReactNode;
}

function DrawerGroup({ label, icon, children }: DrawerGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View>
      <Pressable
        style={styles.drawerItem}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color={theme.colors.text}
        />
        <Text style={styles.drawerLabel}>{label}</Text>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.colors.text}
          style={styles.expandIcon}
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.groupContent}>
          {children}
        </View>
      )}
    </View>
  );
}

export function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const currentRoute = state.routes[state.index].name;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        icon="home"
        onPress={() => navigation.navigate('home')}
        isActive={currentRoute === 'home'}
      />

      <DrawerGroup label="Workouts" icon="fitness-center">
        <DrawerItem
          label="All Workouts"
          icon="list"
          onPress={() => navigation.navigate('workouts')}
          isActive={currentRoute === 'workouts'}
          indent
        />
        <DrawerItem
          label="Create Workout"
          icon="add-circle"
          onPress={() => navigation.navigate('new-workout')}
          isActive={currentRoute === 'new-workout'}
          indent
        />
      </DrawerGroup>

      <DrawerGroup label="Exercises" icon="sports-handball">
        <DrawerItem
          label="All Exercises"
          icon="list"
          onPress={() => navigation.navigate('exercises')}
          isActive={currentRoute === 'exercises'}
          indent
        />
        <DrawerItem
          label="Create Exercise"
          icon="add-box"
          onPress={() => navigation.navigate('new-exercise')}
          isActive={currentRoute === 'new-exercise'}
          indent
        />
      </DrawerGroup>

      <DrawerItem
        label="Shared Workouts"
        icon="share"
        onPress={() => navigation.navigate('shared')}
        isActive={currentRoute === 'shared'}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  drawerLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  activeItem: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  indentedItem: {
    paddingLeft: 32,
  },
  groupContent: {
    backgroundColor: `${theme.colors.text}10`,
  },
  expandIcon: {
    marginLeft: 'auto',
  },
}); 