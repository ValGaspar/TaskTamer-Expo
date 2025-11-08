import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#70816C',
        tabBarInactiveTintColor: 'black',
        tabBarButton: HapticTab,
        tabBarBackground: () => null,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 14,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Ionicons name={Platform.OS === 'ios' ? 'home-sharp' : 'home-outline'} size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
