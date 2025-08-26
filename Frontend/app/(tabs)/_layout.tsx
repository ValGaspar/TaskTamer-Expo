import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#70816C',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontWeight: 'normal',
          fontSize: 14,
          marginTop: 3,    
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={30}
              name="house.fill"
              color={color || 'black'}
            />
          ),
          title: 'Início',
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={30}
              name="square.grid.2x2.fill"
              color={color || 'black'}
            />
          ),
          title: 'Categorias',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={30}
              name="person.fill"
              color={color || 'black'}
            />
          ),
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
