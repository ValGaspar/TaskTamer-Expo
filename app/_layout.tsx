import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 2000);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#98B88F' }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}