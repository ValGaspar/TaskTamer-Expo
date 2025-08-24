import React, { useState, useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Asset } from 'expo-asset';
import { login } from '@/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        require('@/assets/images/title.png'),
        require('@/assets/images/email.png'),
        require('@/assets/images/padlock.png'),
      ]);
      setLoadingAssets(false);
    }
    loadAssets();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoadingLogin(true);
    try {
      await login(email, password); // chama o service
      router.replace('/home'); // navega após salvar token
    } catch (error) {
      let errorMessage = 'Credenciais inválidas.';
      if (error instanceof Error) errorMessage = error.message;
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoadingLogin(false);
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
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.stepContainer}>
        <Image source={require('@/assets/images/title.png')} style={styles.TaskTamerLogo} />
        <ThemedText style={styles.titleContainer}>Login</ThemedText>

        <View style={styles.inputSpacing} />

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
          />
        </ThemedView>

        <View style={styles.buttonSpacing} />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loadingLogin}>
          {loadingLogin ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Entrar</ThemedText>}
        </TouchableOpacity>

        <ThemedView style={styles.line} />

        <ThemedText style={styles.text}>
          Não tem uma conta? Toque para
          <Link style={styles.criar} href="/cadastro"> Criar</Link>
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  stepContainer: { flex: 1, alignItems: 'center', backgroundColor: 'white', paddingTop: 60 },
  TaskTamerLogo: { width: '80%', resizeMode: 'contain', marginBottom: 150 },
  titleContainer: { textAlign: 'center', fontWeight: 'bold', fontSize: 24, lineHeight: 30, color: 'black', marginBottom: 65, fontFamily: 'Poppins_400Regular' },
  button: { backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins_400Regular' },
  input: { flex: 1, height: 45, borderRadius: 8, paddingHorizontal: 10, fontSize: 16, backgroundColor: '#98B88F', fontFamily: 'Poppins_400Regular' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 10, width: '75%', marginBottom: 20 },
  icon: { width: 20, height: 20, marginRight: 10 },
  line: { borderColor: 'black', width: '100%', height: 1, marginVertical: 30, marginTop: 170 },
  text: { color: 'black', fontFamily: 'Poppins_400Regular', fontSize: 15 },
  criar: { fontFamily: 'Poppins_400Regular', color: '#98B88F', fontSize: 15 },
  inputSpacing: { flex: 0.1 },
  buttonSpacing: { flex: 0.2 },
});
