import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.43

type Props = {
  title: string;
  percentage: number;
  icon: ImageSourcePropType;
  taskCount?: number;
};

export function ProgressCard({ title, percentage, icon, taskCount }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.content}>
        <Image 
          source={icon} 
          style={styles.icon} 
          resizeMode="contain"
        />

        <View style={styles.numbersContainer}>
          <Text style={styles.percentage}>{percentage}%</Text>
          <Text style={styles.taskCount}> {taskCount ?? 0} tarefas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#98B88F',
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: Math.min(CARD_SIZE * 0.1, 18), 
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#98B88F',
    color: '#000',
    width: '100%',
    textAlign: 'center',
    paddingVertical: CARD_SIZE * 0.05,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: CARD_SIZE * 0.05,
  },
  icon: {
    width: Math.min(CARD_SIZE * 0.48, 78),  
    height: Math.min(CARD_SIZE * 0.48, 78),
  },
  numbersContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  percentage: {
    fontSize: Math.min(CARD_SIZE * 0.2, 30), 
    fontFamily: 'Limelight_400Regular',
    color: '#516953',
  },
  taskCount: {
    fontSize: Math.min(CARD_SIZE * 0.07, 12),
    fontFamily: 'Poppins_400Regular',
    color: '#000',
  },
});
