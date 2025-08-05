import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedView style={styles.box} />
      <ThemedView style={styles.box} />
      <ThemedView style={styles.box} />
      <ThemedView style={styles.box} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',   
    backgroundColor: 'white',
  },
  box: {
    backgroundColor: '#98B88F',
    borderRadius: 10,
    padding: 65,       
    minWidth: 300,
    marginBottom: 30, 
  },
});
