import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { useRouter, Link } from 'expo-router';

export default function cadastroScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.stepContainer}>
      <Image 
        source={require('@/assets/images/title.png')}
        style={styles.TaskTamerLogo}
      />
      <ThemedText style={styles.titleContainer}>Cadastro</ThemedText>

      <View style={styles.inputSpacing} />
      
      <ThemedView style={styles.inputContainer}>
        <Image 
          source={require('@/assets/images/profile.png')}
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Nome" 
          placeholderTextColor="#ffff"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <Image 
          source={require('@/assets/images/email.png')}
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="E-mail" 
          placeholderTextColor="#ffff"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <Image 
          source={require('@/assets/images/padlock.png')}
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          placeholderTextColor="#ffff"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <Image 
          source={require('@/assets/images/padlock.png')}
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirmar senha" 
          placeholderTextColor="#ffff"
        />
      </ThemedView>

      <View style={styles.buttonSpacing} />

      <TouchableOpacity style={styles.button}>
        <ThemedText style={styles.buttonText} onPress={() => router.navigate('/home')}>
          Criar
        </ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.line}></ThemedView>

      <ThemedText style={styles.text}>
        Já tem uma conta? Toque para
        <Link style={styles.criar} href='/login'> Entrar</Link>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
    color: 'black',
    marginTop: 80,
    marginBottom: 30,
    fontFamily: 'Poppins_400Regular',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 60,
  },
  TaskTamerLogo: {
    width: '80%', 
    resizeMode: 'contain',
    marginBottom: 0, // <-- Igual ao login agora
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 25, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  }, 
  input: {
    flex: 1,
    height: 45,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 0,
    fontSize: 16,
    backgroundColor: '#98B88F',
    fontFamily: 'Poppins_400Regular'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '75%',
    marginBottom: 20
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  line: {
    borderColor: 'black',
    width: '100%',
    height: 1,
    marginVertical: 30,
    marginTop: 170 // <-- Igual ao login agora
  },
  text: {
    color: 'black',
    fontFamily: 'Poppins_400Regular',
    fontSize: 15
  },
  criar: {
    fontFamily: 'Poppins_400Regular',
    color: '#98B88F',
    fontSize: 15
  },
  inputSpacing: {
    flex: 0.1,
  },
  buttonSpacing: {
    flex: 0.2, // <-- Igual ao login agora
  },
});
