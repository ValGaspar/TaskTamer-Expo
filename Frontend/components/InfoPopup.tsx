import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

export default function InfoPopup({ visible, onClose, title, message }: Props) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Fechar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 14,
    width: 300,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 10,
    color: '#4A5C42',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
  },
});
