import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image, StyleSheet, TouchableOpacity, TextInput, View, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoadFonts } from '../hooks/useLoadFonts';

export default function CadastroScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const fontsLoaded = useLoadFonts();

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

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErroSenha('');
  }, []);

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(senha);
  };

  const handleCreateUser = async () => {
    setErroSenha('');

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (!validarSenha(password)) {
      setErroSenha('A senha deve ter no mínimo 6 caracteres, incluindo pelo menos uma letra e um número.');
      return;
    }

    setLoadingCreate(true);
    try {
      const response = await fetch('http://192.168.255.129:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userName', data.name);
        await AsyncStorage.setItem('userId', data.id);
        await AsyncStorage.setItem('userEmail', data.email);

        await AsyncStorage.setItem('userLoggedIn', 'false');

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        router.replace('/login');
      } else {
        Alert.alert('Erro', data.message || 'Erro ao criar usuário');
      }
    } catch (error) {
      Alert.alert('Erro', 'Aguardando conexão.');
    } finally {
      setLoadingCreate(false);
    }
  };

  if (!fontsLoaded || loadingAssets) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ fontFamily: 'Poppins-Regular' }}>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.stepContainer}>
          <Image source={require('@/assets/images/title.png')} style={styles.TaskTamerLogo} />
          <ThemedText style={[styles.titleContainer, { fontFamily: 'Poppins-Regular' }]}>Cadastro</ThemedText>

          <View style={styles.inputSpacing} />

          <ThemedView style={styles.inputContainer}>
            <Image source={require('@/assets/images/profile.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#fff"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              autoComplete="off"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <Image source={require('@/assets/images/email.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              autoComplete="off"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <Image source={require('@/assets/images/padlock.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#fff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <Image source={require('@/assets/images/padlock.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#fff"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
            />
          </ThemedView>

          <View style={styles.errorContainer}>
            {erroSenha ? <ThemedText style={styles.errorText}>{erroSenha}</ThemedText> : null}
          </View>

          <View style={styles.buttonSpacing} />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateUser}
            disabled={loadingCreate}
          >
            {loadingCreate ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={[styles.buttonText, { fontFamily: 'Poppins-Regular' }]}>
                Criar
              </ThemedText>
            )}
          </TouchableOpacity>

          <ThemedText style={styles.text}>
            Já tem uma conta? Toque para{' '}
            <ThemedText
              style={styles.criar}
              onPress={() => router.replace('/home')}
            >
              Entrar
            </ThemedText>
          </ThemedText>

        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: 'center',
    fontSize: 24,
    padding: 10,
    color: 'black',
    marginTop: 80,
    marginBottom: 30,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 80,
  },
  TaskTamerLogo: {
    width: '80%',
    resizeMode: 'contain',
    marginBottom: '15%',
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
    textAlign: 'center',
  },
  inputContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    width: '75%',
    backgroundColor: '#98B88F',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    paddingTop: Platform.OS === 'android' ? 0 : 2,
    paddingBottom: Platform.OS === 'android' ? 0 : 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    paddingTop: 100
  },
  criar: {
    fontFamily: 'Poppins-Regular',
    color: '#98B88F',
    fontSize: 15,
  },
  inputSpacing: {
    flex: 0.1,
  },
  buttonSpacing: {
    flex: 0.2,
  },
  errorContainer: {
    width: '75%',
    minHeight: 20,
    marginBottom: 0
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: "center"
  },
});
