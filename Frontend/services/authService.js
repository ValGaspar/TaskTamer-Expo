import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao realizar login');
  }

  await AsyncStorage.setItem('accessToken', data.accessToken);
  await AsyncStorage.setItem('refreshToken', data.refreshToken);
  await AsyncStorage.setItem('userId', data.userId);
  await AsyncStorage.setItem('userName', data.name);
  await AsyncStorage.setItem('userEmail', data.email);
  await AsyncStorage.setItem('isLoggedIn', 'true');

  return data;
};
