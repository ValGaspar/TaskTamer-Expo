import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function ProfileScreen() {
  return (
    <ThemedView style={styles.stepContainer}>
      <IconSymbol name="person.crop.circle" weight="thin" size={180} color="black" />
      <ThemedText style={styles.userName}>Nome do Perfil</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 80,  // aumenta o espaçamento do topo
    paddingHorizontal: 25, // mantem o padding lateral
    height: '100%',
  },
  userName: {
    marginTop: 20,
    fontSize: 22,
    color: "black",
    fontFamily: 'Poppins_400Regular',
  }
});
