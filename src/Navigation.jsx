// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TodoListScreen from '../src/components/TodoListScreen';
import TaskDetailScreen from '../src/components/TaskDetailScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TodoList">
        <Stack.Screen name="ProcureEase " component={TodoListScreen} />
        <Stack.Screen name="New Provider" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
