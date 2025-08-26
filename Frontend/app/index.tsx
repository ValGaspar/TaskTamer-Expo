import React from 'react';
import { useFonts } from 'expo-font';
import { useAssets } from 'expo-asset';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular,
  });

  const [assetsLoaded] = useAssets([require('@/assets/images/Tasktamer.png')]);

  if (!fontsLoaded || !assetsLoaded) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText>Carregando recursos...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/Tasktamer.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>Seja bem-vindo!</ThemedText>
      <ThemedText style={styles.text}>
          Organize seu dia, mantenha o foco e assuma o controle das suas tarefas, um passo por vez rumo às suas metas diárias.
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={() => router.navigate('/login')}>
        <ThemedText style={styles.buttonText}>Iniciar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: '60%',
    height: width * 0.6,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
    fontFamily: 'Limelight_400Regular',
    color: 'black',
  },
  text: {
    width: 220,
    textAlign: 'justify',
    color: 'black',
    margin: 30,
    fontSize: 14,
    fontFamily: 'LibreBaskerville_400Regular',
    lineHeight: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
});
