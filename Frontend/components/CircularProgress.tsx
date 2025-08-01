import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

type Props = {
  size?: number;
  width?: number;
  fill: number; // de 0 a 100
  tintColor?: string;
  backgroundColor?: string;
};

export const CircularProgress = ({
  size = 160,
  width = 5,
  fill,
  tintColor = '#376A3E',
  backgroundColor = '#D1E5CE',
}: Props) => {
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={width}
        fill={fill}
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View>
            {/* Porcentagem Tarefas */}
            <Text style={styles.percent}> 80% </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontSize: 35,
    fontFamily: 'Limelight_400Regular'
  }
});