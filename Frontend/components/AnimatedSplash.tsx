import { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';

type Props = {
  finish: () => void;
};

export default function AnimatedSplash({ finish }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        await Asset.loadAsync([
          require('@/assets/images/TasktamerLogo.png'),
          require('@/assets/images/Tasktamer.png'),
          require('@/assets/images/title.png'),
          require('@/assets/images/email.png'),
          require('@/assets/images/padlock.png'),
          require("@/assets/images/perfil.png")
        ]);
      } catch (e) {
        console.warn('Erro ao carregar imagens:', e);
      }
      setImagesLoaded(true);
    }
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        finish();
      }, 1000);
    });
  }, [imagesLoaded]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/assets/images/TasktamerLogo.png')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98B88F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
