import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://192.168.255.112:3000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        router.push('/home');
      } else {
        Alert.alert('Erro', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <ThemedView style={styles.stepContainer}>
      <Image 
        source={require('@/assets/images/title.png')}
        style={styles.TaskTamerLogo}
      />
      <ThemedText style={styles.titleContainer}>Login</ThemedText>

      <View style={styles.inputSpacing} />

      <ThemedView style={styles.inputContainer}>
        <Image 
          source={require('@/assets/images/email.png')}
          style={styles.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="E-mail" 
          placeholderTextColor="#ffff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </ThemedView>

      <View style={styles.buttonSpacing} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Entrar</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.line} />

      <ThemedText style={styles.text}>
        Não tem uma conta? Toque para
        <Link style={styles.criar} href='/cadastro'> Criar</Link>
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
    marginBottom: 80,
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
    marginBottom: 150, 
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
    marginTop: 170
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
    flex: 0.2,
  },
});
