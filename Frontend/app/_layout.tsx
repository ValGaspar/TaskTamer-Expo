import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import AnimatedSplash from '../components/AnimatedSplash';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Previne que o splash desapareça automaticamente
        await SplashScreen.preventAutoHideAsync();

        // Carrega sua logo
        await Asset.loadAsync([
          require('@/assets/images/TasktamerLogo.png'),
        ]);

        // Simula qualquer outro carregamento (opcional)
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
    await SplashScreen.hideAsync(); // Só oculta aqui!
    setSplashDone(true);
  }, []);

  if (!appIsReady) {
    return null; // Nada enquanto carrega
  }

  if (!splashDone) {
    return <AnimatedSplash finish={onSplashAnimationEnd} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#98B88F' }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
