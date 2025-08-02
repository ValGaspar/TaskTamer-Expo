import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadName = async () => {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
      }
    };

    loadName();
  }, []);

  return (
    <ThemedView style={styles.stepContainer}>
      <IconSymbol name="person.crop.circle" weight="thin" size={180} color="black" />
      <ThemedText style={styles.userName}>{userName || 'Nome do Perfil'}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 25,
    height: '100%',
  },
  userName: {
    marginTop: 20,
    fontSize: 22,
    color: 'black',
    fontFamily: 'Poppins_400Regular',
  },
});
