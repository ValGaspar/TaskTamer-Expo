// services/userService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const deleteAccount = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não fornecido');

  const res = await fetch('https://tasktamer-expo.onrender.com/users', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao excluir conta');
  return data;
};
