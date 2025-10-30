import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import AnimatedSplash from '../components/AnimatedSplash';
import { ProgressProvider } from '../components/ProgressContext';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Asset.loadAsync([require('@/assets/images/TasktamerLogo.png')]);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onSplashAnimationEnd = useCallback(async () => {
    await SplashScreen.hideAsync();
    setSplashDone(true);
  }, []);

  if (!appIsReady) return null;
  if (!splashDone) return <AnimatedSplash finish={onSplashAnimationEnd} />;

  return (
    <ProgressProvider>
      <View style={{ flex: 1, backgroundColor: '#98B88F' }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ProgressProvider>
  );
}
