import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image, StyleSheet, TouchableOpacity, TextInput, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Asset } from 'expo-asset';

export default function CadastroScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        require('@/assets/images/title.png'),
        require('@/assets/images/profile.png'),
        require('@/assets/images/email.png'),
        require('@/assets/images/padlock.png'),
      ]);
      setLoadingAssets(false);
    }
    loadAssets();
  }, []);

  const handleCreateUser = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoadingCreate(true);
    try {
      const response = await fetch('https://tasktamer-expo.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Sua conta foi criada!');
        router.push('/home');
      } else {
        const data = await response.json();
        Alert.alert('Erro', data.message || 'Erro ao criar usuário');
      }
    } catch (error) {
      Alert.alert('Erro', 'Aguardando conexão.');
    } finally {
      setLoadingCreate(false);
    }
  };

  if (loadingAssets) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

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
          value={name}
          onChangeText={setName}
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

      <ThemedView style={styles.inputContainer}>
        <Image
          source={require('@/assets/images/padlock.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#ffff"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </ThemedView>

      <View style={styles.buttonSpacing} />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateUser}
        disabled={loadingCreate}
      >
        {loadingCreate ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Criar</ThemedText>
        )}
      </TouchableOpacity>

      <ThemedView style={styles.line} />

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
    marginBottom: 0,
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
    marginTop: 170,
  },
  text: {
    color: 'black',
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  criar: {
    fontFamily: 'Poppins_400Regular',
    color: '#98B88F',
    fontSize: 15,
  },
  inputSpacing: {
    flex: 0.1,
  },
  buttonSpacing: {
    flex: 0.2,
  },
});
