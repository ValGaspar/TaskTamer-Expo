import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task, TaskPayload } from '@/services/types';

interface TaskFilter {
  date?: string;
}


interface ApiError {
  message?: string;
}

export const list = async (filter: TaskFilter): Promise<Task[]> => {
  console.log('listTask')
  const token = await AsyncStorage.getItem('accessToken');
  const userId = await AsyncStorage.getItem('userId');
  const params = new URLSearchParams();
  
  if (filter.date != null)
    params.append("date", filter.date)
  else
    params.append("date", new Date(Date.now()).toISOString().split('T')[0])
  
  const res = await fetch(`http://192.168.255.129:3000/tasks/user/${userId}?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data: Task[] | ApiError = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).message || 'Erro ao carregar Tasks');
  }
  console.log(data)
  return data as Task[];
};

export const create = async (task: Task) => {
  const token = await AsyncStorage.getItem('accessToken');

  const res = await fetch(`http://192.168.255.129:3000/tasks/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task)
  });

  const data: Task | ApiError = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).message || 'Erro ao criar Task');
  }
  console.log(data)
  return data as Task;
}

export const update = async (id: string, payload: TaskPayload) => {
  const token = await AsyncStorage.getItem('accessToken');

  const res = await fetch(`http://192.168.255.129:3000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const data: Task | ApiError = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).message || 'Erro ao atualizar Tasks');
  }
  console.log(data)
  return data as Task;
}

export const destroy = async (id: string ) => {
  const token = await AsyncStorage.getItem('accessToken');

  const res = await fetch(`http://192.168.255.129:3000/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data: Task | ApiError = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).message || 'Erro ao deletar Task');
  }
  console.log(data)
  return data as Task;
}