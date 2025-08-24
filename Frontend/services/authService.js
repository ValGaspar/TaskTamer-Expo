import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const res = await fetch('https://tasktamer-expo.onrender.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login falhou');

  await AsyncStorage.setItem('accessToken', data.accessToken);
  await AsyncStorage.setItem('refreshToken', data.refreshToken);
  await AsyncStorage.setItem('userName', data.name);
  await AsyncStorage.setItem('userId', data.userId);
  await AsyncStorage.setItem('userEmail', data.email || '');
};

export const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch('https://tasktamer-expo.onrender.com/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) return null;

  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};
