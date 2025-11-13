import AsyncStorage from '@react-native-async-storage/async-storage';

export const deleteAccount = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const userId = await AsyncStorage.getItem('userId');
  if (!token) throw new Error('Token não fornecido');
  if (!userId) throw new Error('Usuário não encontrado');

  const res = await fetch(`http://192.168.255.129:3000/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'Conta deletada com sucesso!' };
  }

  if (!res.ok) throw new Error(data.message || 'Erro ao deletar conta');

  return data;
};
