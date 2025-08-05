import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Asset } from 'expo-asset';

type TaskData = {
  title: string;
  description: string;
  date: Date;
  priority: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  type: 'tarefa' | 'compromisso';
  initialData?: TaskData | null;
};

const calendarIcon = require('@/assets/images/calendarIcon.png');
const etiquetaIcon = require('@/assets/images/etiquetaIcon.png');

const PRIORITY_OPTIONS = [
  'Prioridade Alta',
  'Prioridade Média',
  'Prioridade Baixa',
];

export const TaskDetailPopUp = ({
  visible,
  onClose,
  onSubmit,
  type,
  initialData = null,
}: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[0]);
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [priorityButtonLayout, setPriorityButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // Pré-carregamento das imagens para evitar delay
  useEffect(() => {
    Asset.loadAsync([calendarIcon, etiquetaIcon]);
  }, []);

  useEffect(() => {
    if (visible) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setDate(initialData?.date || new Date());
      setPriority(initialData?.priority || PRIORITY_OPTIONS[0]);
      setShowPriorityOptions(false);
    }
  }, [visible, initialData]);

  if (!fontsLoaded) return null;

  const handleSubmit = () => {
    if (title.trim() === '') return;
    onSubmit({ title, description, date, priority });
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  const togglePriorityOptions = () => {
    setShowPriorityOptions((prev) => !prev);
  };

  const selectPriority = (option: string) => {
    setPriority(option);
    setShowPriorityOptions(false);
  };

  const onPriorityButtonLayout = (event: any) => {
    setPriorityButtonLayout(event.nativeEvent.layout);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>
              {initialData ? 'Editar ' : 'Nova '} {type === 'tarefa' ? 'Tarefa' : 'Compromisso'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputButton}>
              <Image source={calendarIcon} style={styles.icon} />
              <Text style={styles.inputButtonText}>{date.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={handleCancelDate}
              minimumDate={new Date()}
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
            />

            <View style={{ width: '100%', zIndex: 10 }}>
              <TouchableOpacity
                onPress={togglePriorityOptions}
                style={styles.inputButton}
                onLayout={onPriorityButtonLayout}
                activeOpacity={0.7}
              >
                <Image source={etiquetaIcon} style={styles.icon} />
                <Text style={styles.inputButtonText}>{priority}</Text>
              </TouchableOpacity>

              {showPriorityOptions && priorityButtonLayout && (
                <View
                  style={[
                    styles.priorityDropdown,
                    {
                      position: 'absolute',
                      top: priorityButtonLayout.height + 4,
                      left: 0,
                      width: priorityButtonLayout.width,
                    },
                  ]}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => selectPriority(option)}
                      style={[
                        styles.priorityOption,
                        option === priority && styles.priorityOptionSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.priorityOptionText,
                          option === priority && styles.priorityOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>{initialData ? 'Confirmar' : 'Salvar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

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
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  inputButtonText: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#333',
  },
  priorityDropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 20,
  },
  priorityOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  priorityOptionSelected: {
    backgroundColor: '#98B88F',
    borderRadius: 6,
  },
  priorityOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
  },
  priorityOptionTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
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
