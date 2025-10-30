import React, { useState, useContext } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import EditProfilePopup from "@/components/EditProfilePopup";
import InfoPopup from "@/components/InfoPopup";
import { ProgressContext } from "@/components/ProgressContext";
import { deleteAccount } from "@/services/userService";

const ProfileScreen = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  const { streak, totalDays } = useContext(ProgressContext);

  const router = useRouter();

  // Carrega dados do usuário ao montar
  React.useEffect(() => {
    const loadUserData = async () => {
      const savedName = await AsyncStorage.getItem("userName");
      const savedEmail = await AsyncStorage.getItem("userEmail");
      if (savedName) setUserName(savedName);
      if (savedEmail) setUserEmail(savedEmail);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Confirmação", "Deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userLoggedIn");
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const data = await deleteAccount();
              await AsyncStorage.clear();
              Alert.alert("Sucesso", data.message || "Conta deletada com sucesso!");
              router.replace("/login");
            } catch (error) {
              let errorMessage = "Erro ao excluir conta.";
              if (error instanceof Error) errorMessage = error.message;
              Alert.alert("Erro", errorMessage);
            }
          },
        },
      ]
    );
  };

  const options = ["Editar Perfil", "Ajuda", "Sobre o App"];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.stepContainer}>
        <Image
          source={require("@/assets/images/TasktamerLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.userName}>{userName || "Nome do Usuário"}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        <ThemedView style={[styles.cardSmall, { width: 140 }]}>
          <ThemedText style={styles.cardNumber}>{streak}</ThemedText>
          <ThemedText style={styles.cardLabel}>Sequência</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.cardLarge, { width: 200 }]}>
          <ThemedText style={styles.cardNumber}>{totalDays}</ThemedText>
          <ThemedText style={styles.cardLabel}>Dias Produtivos</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.bodyContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              if (item === "Editar Perfil") setEditVisible(true);
              else if (item === "Ajuda") setHelpVisible(true);
              else if (item === "Sobre o App") setAboutVisible(true);
            }}
          >
            <ThemedText style={styles.optionText}>{item}</ThemedText>
            <ThemedText style={{ fontSize: 18 }}>›</ThemedText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <EditProfilePopup
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={async (newName: string) => {
          setUserName(newName);
          if (newName) await AsyncStorage.setItem("userName", newName);
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  stepContainer: { alignItems: "center", paddingTop: 80, height: "45%" },
  logo: { width: 170, height: 170, marginBottom: 10 },
  userName: { marginTop: 20, fontSize: 22, color: "black", fontFamily: "Poppins_400Regular" },
  cardsContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  cardSmall: {
    height: 90,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 10,
  },
  cardLarge: {
    height: 90,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 10,
  },
  cardNumber: { fontSize: 20, fontWeight: "bold", color: "#000", fontFamily: "Poppins_400Regular" },
  cardLabel: { fontSize: 15, color: "#000", marginTop: 5, fontFamily: "Poppins_400Regular" },
  bodyContainer: { height: "55%", backgroundColor: "white", paddingTop: 70, alignItems: "center" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: 320,
  },
  optionText: { fontSize: 16, color: "#000", fontFamily: "Poppins_400Regular" },
  logoutButton: {
    marginTop: "15%",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  logoutText: { fontSize: 16, color: "#D86565", fontFamily: "Poppins_400Regular" },
});
