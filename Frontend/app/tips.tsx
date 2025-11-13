import React from 'react';
import { View, Text,  TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TipsScreen() {
  const navigation = useNavigation();

  return (
    <View style={[styles.container]}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#516953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas</Text>
      </View>

    {/* Cards de dicas Fixas */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    marginVertical: 30,
  },
  headerTitle: {
    fontSize: 22,
    color: '#516953',
    fontFamily: 'Poppins_500Medium',
    marginLeft: 10,
  },
});
