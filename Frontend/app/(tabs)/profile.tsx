import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { deleteAccount, updateProfileImage } from "@/services/userService";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";


const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const router = useRouter();

  // Carrega dados do usuário
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

  const pickImage = async () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permissão necessária', 'Precisamos acessar a câmera.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({ quality: 1 });
            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setProfileImage(uri);
              await AsyncStorage.setItem('profileImage', uri);
              try {
                await updateProfileImage(uri);
              } catch (error) {
                console.log(error);
              }
            }
          },
        },
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
              setProfileImage(uri);
              await AsyncStorage.setItem('profileImage', uri);
              try {
                await updateProfileImage(uri);
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
              await updateProfileImage('');
            } catch (error) {
              console.log(error);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
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
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
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
      ]
    );
  };

  const options = ['Editar Perfil', 'Ajuda', 'Sobre o App'];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <IconSymbol name="person.crop.circle" size={140} color="#888" />
          )}
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <IconSymbol name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.userName}>{userName || 'Nome do Perfil'}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardsContainer}>
        <ThemedView style={[styles.cardSmall, { width: 140 }]}>
          <ThemedText style={styles.cardNumber}>0</ThemedText>
          <ThemedText style={styles.cardLabel}>Sequência</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.cardLarge, { width: 200 }]}>
          <ThemedText style={styles.cardNumber}>0</ThemedText>
          <ThemedText style={styles.cardLabel}>Dias Concluídos</ThemedText>
        </ThemedView>
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
        message="Este aplicativo foi desenvolvido para auxiliar jovens com TDAH a organizar suas tarefas e manter o foco diário, com funcionalidades de lista de tarefas, lembretes e progresso."
      />
    </ThemedView>
  );
};

import { StyleSheet } from "react-native";
import InfoPopup from "@/components/InfoPopup";
import EditProfilePopup from "@/components/EditProfilePopup";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
 profileContainer: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  width: 170,
  height: 170,
  borderRadius: 85,
  overflow: 'hidden',
  backgroundColor: '#f0f0f0',
},
profileImage: {
  width: '100%',
  height: '100%',
},
addButton: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#000',
  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '#fff',
},
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 80, paddingHorizontal: 25,
    height: '45%'
  },
  userName: {
    marginTop: 20,
    fontSize: 22,
    color: 'black',
    fontFamily: 'Poppins_400Regular'
  },
  cardsContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cardSmall: {
    height: 90,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  cardLarge: {
    height: 90,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins_400Regular'
  },
  cardLabel: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
    fontFamily: 'Poppins_400Regular'
  },
  bodyContainer: {
    height: '55%',
    backgroundColor: 'white',
    paddingTop: 70,
    alignItems: 'center'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: 320,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_400Regular'
  },
  logoutButton: {
    marginTop: '15%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  logoutText: {
    fontSize: 16,
    color: '#D86565',
    fontFamily: 'Poppins_400Regular'
  },
});

export default ProfileScreen;
