import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import EditProfilePopup from '@/components/EditProfilePopup';
import InfoPopup from '@/components/InfoPopup';
import { deleteAccount, updateProfileImage } from '@/services/userService';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const router = useRouter();

  // Carrega dados do usuário do AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const savedName = await AsyncStorage.getItem('userName');
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedImage = await AsyncStorage.getItem('profileImage');

      if (savedName) setUserName(savedName);
      if (savedEmail) setUserEmail(savedEmail);
      if (savedImage) setProfileImage(savedImage);
    };
    loadUserData();
  }, []);

  // Escolher/alterar imagem de perfil
  const pickImage = async () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção',
      [
        {
          text: 'Galeria',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              try {
                const uploadedUrl = await updateProfileImage(uri);
                setProfileImage(uploadedUrl.profileImage || uri);
                await AsyncStorage.setItem('profileImage', uploadedUrl.profileImage || uri);
              } catch (error) {
                console.log(error);
                Alert.alert('Erro', 'Não foi possível atualizar a imagem no servidor');
              }
            }
          },
        },
        {
          text: 'Remover Foto',
          style: 'destructive',
          onPress: async () => {
            setProfileImage(null);
            await AsyncStorage.removeItem('profileImage');
            try {
              await updateProfileImage(''); // remove do servidor
            } catch (error) {
              console.log(error);
              Alert.alert('Erro', 'Não foi possível remover a imagem do servidor');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  // Logout
  const handleLogout = async () => {
    Alert.alert('Confirmação', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.setItem('isLoggedIn', 'false');
          router.replace('/login');
        },
      },
    ]);
  };

  // Deletar conta
  const handleDeleteAccount = async () => {
    Alert.alert('Confirmação', 'Deseja excluir sua conta? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const data = await deleteAccount();
            await AsyncStorage.clear();
            Alert.alert('Sucesso', data.message || 'Conta deletada com sucesso!');
            router.replace('/login');
          } catch (error) {
            let errorMessage = 'Erro ao excluir conta.';
            if (error instanceof Error) errorMessage = error.message;
            Alert.alert('Erro', errorMessage);
          }
        },
      },
    ]);
  };

  const options = ['Editar Perfil', 'Ajuda', 'Sobre o App'];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <IconSymbol name="person.crop.circle" size={170} color="black" />
          )}
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <IconSymbol name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.userName}>{userName || 'Nome do Perfil'}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.bodyContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              if (item === 'Editar Perfil') setEditVisible(true);
              else if (item === 'Ajuda') setHelpVisible(true);
              else if (item === 'Sobre o App') setAboutVisible(true);
            }}
          >
            <ThemedText style={styles.optionText}>{item}</ThemedText>
            <IconSymbol name="chevron.right" size={18} color="#000" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Popups */}
      <EditProfilePopup
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={async (newName: string) => {
          setUserName(newName);
          if (newName) await AsyncStorage.setItem('userName', newName);
        }}
        onDeleteAccount={handleDeleteAccount}
        currentName={userName}
        currentEmail={userEmail}
      />

      <InfoPopup
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title="Ajuda"
        message="Entre em contato com a autora: Valentina Gaspar M, Turma: Informática 63 2."
      />

      <InfoPopup
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
        title="Sobre o App"
        message="Este aplicativo auxilia jovens com TDAH a organizar tarefas e manter foco diário."
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  stepContainer: { display: 'flex', alignItems: 'center', paddingTop: 80, paddingHorizontal: 25, height: '45%' },
  profileContainer: { position: 'relative', alignItems: 'center' },
  profileImage: { width: 155, height: 155, borderRadius: 90, borderWidth: 4, borderColor: '#516953' },
  addButton: { position: 'absolute', bottom: 0, right: 10, backgroundColor: 'black', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userName: { marginTop: 20, fontSize: 22, color: 'black' },
  bodyContainer: { paddingTop: 40, alignItems: 'center' },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee', width: 320 },
  optionText: { fontSize: 16, color: '#000' },
  logoutButton: { marginTop: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, width: 320 },
  logoutText: { fontSize: 16, color: '#D86565' },
});
