import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para deletar a conta do usuário logado
export const deleteAccount = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const userId = await AsyncStorage.getItem('userId');
  if (!token) throw new Error('Token não fornecido');
  if (!userId) throw new Error('Usuário não encontrado');

  const res = await fetch(`https://tasktamer-expo.onrender.com/users/${userId}`, {
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

// Função para atualizar imagem de perfil do usuário logado
export const updateProfileImage = async (profileImage: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  const userId = await AsyncStorage.getItem('userId');
  if (!token) throw new Error('Token não fornecido');
  if (!userId) throw new Error('Usuário não encontrado');

  const res = await fetch(`https://tasktamer-expo.onrender.com/users/${userId}/profile-image`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profileImage }),
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'Imagem atualizada com sucesso!' };
  }

  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar imagem');

  return data;
};
