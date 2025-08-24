import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  onDeleteAccount: () => void;
  currentName: string;
  currentEmail: string;
};

export default function EditProfilePopup({ visible, onClose, onSave, onDeleteAccount, currentName, currentEmail }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (visible) {
      setName(currentName || '');
    }
  }, [visible, currentName]);

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    await AsyncStorage.setItem('userName', name);
    onSave(name);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDeleteAccount },
      ]
    );
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="E-mail"
              placeholderTextColor="#999"
              value={currentEmail || ''}
              editable={false}
            />

            {/* Botões lado a lado */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.deleteButton, { flex: 1, marginRight: 5 }]} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Excluir Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.saveButton, { flex: 1, marginLeft: 5 }]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
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
    color: '#4A5C42',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    backgroundColor: '#E8E8E8',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  disabledInput: {
    backgroundColor: '#D3D3D3',
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  deleteButton: {
    backgroundColor: '#D86565',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  cancelText: {
    marginTop: 15,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
  },
});
