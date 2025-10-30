import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import type { RootStackParamList } from '../rootNavigator';

const categories = [
  { id: '1', name: 'Tarefas', image: require('@/assets/images/tasks.png') },
  { id: '2', name: 'Relatório de Atividade', image: require('@/assets/images/report.png') },
  { id: '3', name: 'Calendário', image: require('@/assets/images/calendar.png') },
  { id: '4', name: 'Dicas', image: require('@/assets/images/tips.png') },
];

export default function CategoriesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loadingAssets, setLoadingAssets] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      const images = categories.map(cat => cat.image);
      await Asset.loadAsync(images);
      setLoadingAssets(false);
    }
    loadAssets();
  }, []);

  if (loadingAssets) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#516953" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => {
            if (item.name === 'Tarefas') {
              navigation.getParent()?.navigate('tasks');
            } else if (item.name === 'Relatório de Atividade') {
              navigation.getParent()?.navigate('relatorio');
            } else {
              console.log('Outra categoria:', item.name);
            }
          }}
        >
          <Image source={item.image} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#98B88F',
    borderRadius: 5,
    padding: 20,
    marginVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    width: 35,
    height: 35,
    marginBottom: 35,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
});
