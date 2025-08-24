import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  try {
    const res = await fetch('https://tasktamer-expo.onrender.com/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Tenta ler a resposta como JSON
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Resposta inesperada do servidor');
    }

    if (!res.ok) {
      // Aqui mostra a mensagem do backend, sem cair no "Network request failed"
      throw new Error(data.message || 'Login falhou');
    }

    // Salva os dados do usuário
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
    await AsyncStorage.setItem('userName', data.name);
    await AsyncStorage.setItem('userId', data.userId);
    await AsyncStorage.setItem('userEmail', data.email || '');

    return data;
  } catch (error) {
    // Mostra apenas a mensagem real do erro
    throw new Error(error.message || 'Erro desconhecido ao conectar ao servidor');
  }
};
