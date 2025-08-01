//AQUI É A BARRA DE ÍCONES (Ex: Home, Profile...)
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import inicioIcon from '../../assets/images/inicio.png';
import categoriasIcon from '@/assets/images/category.png';
import profileIcon from '@/assets/images/perfil.png';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: 'grey',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color || 'black'} />,
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="square.grid.2x2.fill" color={color || 'black'} />, // ou "list", "apps"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="person.fill" color={color || 'black'} />, // ou "person", "person-circle"
        }}
      />

    </Tabs>
  );
}
