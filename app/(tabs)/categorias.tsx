import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.titleContainer}>Página de Categorias</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 25,
    height: '100%'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
