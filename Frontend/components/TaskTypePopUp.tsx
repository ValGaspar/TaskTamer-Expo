import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'tarefa' | 'compromisso') => void;
};

export const TaskTypePopUp = ({ visible, onClose, onSelect }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Escolha o tipo</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('tarefa')}  // Chama onSelect ao clicar
          >
            <Text style={styles.optionText}>Tarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('compromisso')}  // Chama onSelect ao clicar
          >
            <Text style={styles.optionText}>Compromisso</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: 260,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  option: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: '#444',
    fontSize: 14,
  },
});
