import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

type Props = {
  size?: number;
  width?: number;
  fill: number;
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
  const circularRef = useRef<AnimatedCircularProgress>(null);
  const [prevFill, setPrevFill] = useState(fill);

  useEffect(() => {
    if (circularRef.current) {
      circularRef.current.reAnimate(prevFill, fill, 1000);
      setPrevFill(fill);
    }
  }, [fill]);

  const fontSize = size * 0.25; // calcula a fonte proporcional ao tamanho do círculo

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        ref={circularRef}
        size={size}
        width={width}
        fill={prevFill} // pra ir a partir do valor anterior
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        rotation={0}
        lineCap="round"
      >
        {(fillValue: number) => (
          <View>
            <Text style={[styles.percent, { fontSize }]}>{Math.round(fillValue)}%</Text>
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
    fontFamily: 'Limelight_400Regular',
  },
});
