import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type TaskWarningPopUpProps = {
    visible: boolean;
    onClose: () => void;
};

export const TaskWarningPopUp: React.FC<TaskWarningPopUpProps> = ({ visible, onClose }) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Image source={require('@/assets/images/Aviso.png')} style={styles.icon} />
                    <Text style={styles.title}>Cuidado!</Text>
                    <Text style={styles.message}>
                        Fique atento ao número de afazeres que estão sendo adicionados, evite gerar sobrecarga.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Concluir</Text>
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
    container: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        width: 160,
        height: 160,
        marginBottom: 15,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins_500Medium",
        marginBottom: 10,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Poppins_400Regular",
    },
    button: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

