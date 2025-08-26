import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const res = await fetch('https://tasktamer-expo.onrender.com/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao realizar login');
  }

  // Salva tokens e dados do usuário
  await AsyncStorage.setItem('accessToken', data.accessToken);
  await AsyncStorage.setItem('refreshToken', data.refreshToken);
  await AsyncStorage.setItem('userId', data.userId);
  await AsyncStorage.setItem('userName', data.name);
  await AsyncStorage.setItem('userEmail', data.email);
  await AsyncStorage.setItem('isLoggedIn', 'true');

  return data;
};
