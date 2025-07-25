import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText>Carregando fontes...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
      <ThemedView style={styles.stepContainer}>
        
        <Image
          source={require('@/assets/images/Tasktamer.png')}
          style={styles.TaskTamerLogo}
        />
        <ThemedText style={styles.titleContainer}>Seja bem-vindo!</ThemedText>
        <ThemedText style={styles.text}>Organize seu dia, mantenha o foco e 
        assuma o controle das suas tarefas — um passo de cada vez, rumo às suas metas. </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.navigate('/login')}>
          <ThemedText style={styles.buttonText}>Iniciar</ThemedText>
        </TouchableOpacity>

      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: 'black',
    marginTop: 140,
    fontFamily: 'Limelight_400Regular',
  },
  stepContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 25,
    height: '100%'
  },
  TaskTamerLogo: {
    width: '60%',
    resizeMode: 'contain',
  },
  text: {
    width: 220,
    textAlign: 'justify',
    color: 'black',
    margin: 30,
    fontSize: 14,
    fontFamily: 'LibreBaskerville_400Regular',
    letterSpacing: 0,
    lineHeight: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 100
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },  
});
