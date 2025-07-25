import { useFonts } from 'expo-font';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { CircularProgress } from '@/components/CircularProgress';
// import DatePickerBox from '@/components/DatePickerBox';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular
  });
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Tarefa 1',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Tarefa 2',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Tarefa 3',
    },
  ];


  const Item = ({ title }: { title: string }) => (
    <ThemedView style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedView style={styles.Container}>
        <CircularProgress fill={80} />
        {/* Dropdown: Escolha de data */}
        
        <ThemedView>
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedView style={styles.item}>
                <Checkbox style={styles.checkbox} />
                <Text style={styles.title}>{item.title}</Text>
              </ThemedView>
            )}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ // css
  stepContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 25,
    height: '100%'
  },
  Container: {
    padding: 50,
    flex: 1,
    height: '100%',
    marginTop: 'auto'
  },
  title: {
    fontSize: 18,
    padding: 10,
    color: 'white'
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: 'black',
    marginRight: 15
  }
});
