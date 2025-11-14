import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TipsScreen() {
    const navigation = useNavigation();

    const tips = [
        {
            id: 1,
            title: 'Como usar este aplicativo',
            description:
                'Assista a um tutorial passo a passo e descubra como aproveitar todos os recursos deste app no seu dia a dia.',
            link: '...',
            icon: 'logo-youtube',
        },
        {
            id: 2,
            title: 'Citação inspiradora',
            description:
                '“Só é possível alcançar um grande êxito quando permanecemos fiéis a nós mesmos.” – Friedrich Nietzsche',
            link: null,
            icon: 'bulb-outline',
        },
        {
            id: 3,
            title: 'Planejamento Diário',
            description:
                '- Defina até 3 prioridades do dia.\n' +
                '- Organize tarefas por importância.\n' +
                '- Inclua pequenos intervalos.\n' +
                '- Revise o que foi concluído.',
            link: null,
            icon: 'time-outline',
        },

    ] as const;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#516953" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dicas</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {tips.map((tip) => (
                    <View key={tip.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name={tip.icon} size={24} color="#516953" />
                            <Text style={styles.cardTitle}>{tip.title}</Text>
                        </View>
                        <Text style={styles.cardDescription}>{tip.description}</Text>

                        {tip.link && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => Linking.openURL(tip.link)}
                            >
                                <Ionicons name="play-circle-outline" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Assistir</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 70,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        color: '#516953',
        fontFamily: 'Poppins-Medium',
        marginLeft: 10,
    },
    card: {
        backgroundColor: '#f2f6f3',
        borderRadius: 14,
        padding: 20,
        margin: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        color: '#2d4e2f',
        fontFamily: 'Poppins-Medium',
        marginLeft: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#3d3d3d',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
        textAlign: 'justify'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#516953',
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
        gap: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
});
