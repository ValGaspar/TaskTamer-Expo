import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './login';
import TabsNavigator from './(tabs)/_layout';
import TasksScreen from './tasks';

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;   
  Tasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} /> 
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
}