import { useFonts } from 'expo-font';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { StyleSheet, Dimensions, FlatList, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { CircularProgress } from '@/components/CircularProgress';
import { TaskTypePopUp } from '@/components/TaskTypePopUp';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular,
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const DATA = [
    { id: '1', title: 'Tarefa 1' },
    { id: '2', title: 'Tarefa 2' },
    { id: '3', title: 'Tarefa 3' },
    { id: '4', title: 'Tarefa 4' },
    { id: '5', title: 'Tarefa 5' },
  ];

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedView style={styles.Container}>
        <CircularProgress fill={80} />

        <ThemedView style={styles.todayBox}>
          <Text style={styles.todayText}>Hoje</Text>
        </ThemedView>

        <View style={styles.listContainer}>
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedView style={styles.item}>
                <Checkbox style={styles.checkbox} />
                <Text style={styles.title}>{item.title}</Text>
              </ThemedView>
            )}
            showsVerticalScrollIndicator={true}
          />
        </View>

        {/* Botão "+ Novo afazer" */}
        <TouchableOpacity style={styles.newTaskButton} onPress={togglePopup}>
          <>
            <Image
              source={require('@/assets/images/maisIcon.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.newTaskText}>Novo afazer</Text>
          </>
        </TouchableOpacity>

        {/* Pop-up de escolha de tipo de afazer */}
        <Modal
          visible={isPopupVisible}
          transparent
          animationType="fade"
          onRequestClose={togglePopup}
        >
          <TaskTypePopUp
            visible={isPopupVisible} // booleano do seu estado
            onClose={togglePopup} // função para fechar o popup
            onSelect={(type) => {
              console.log('Tipo selecionado:', type);
              // aqui você pode fazer algo com 'tarefa' ou 'compromisso'
              togglePopup(); // opcional: fecha o popup após a escolha
            }}
          />

        </Modal>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  Container: {
    flex: 1,
    width: '100%',
    padding: 50,
  },
  todayBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 45,
    minWidth: 260,
    alignSelf: 'center',
  },
  todayText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
  },
  listContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    padding: 10,
    color: 'white',
  },
  item: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: 'black',
    marginRight: 15,
  },
  newTaskButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    minWidth: 220,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconLeft: {
    width: 38,
    height: 38,
    position: 'absolute',
    left: 10,
    resizeMode: 'contain',
  },
  newTaskText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
