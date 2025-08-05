import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';

type TaskItemProps = {
  done: boolean;
  title: string;
  onToggle: () => void;
  onPress: () => void;
};

export function TaskItem({ done, title, onToggle, onPress }: TaskItemProps) {
  const scale = useSharedValue(done ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(done ? 1 : 0, { duration: 200 });
  }, [done]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <ThemedView style={styles.item}>
      <TouchableOpacity
        style={[styles.checkboxBase, done && styles.checkboxChecked]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.checkIconWrapper, animatedStyle]}>
          <FontAwesome name="check" size={20} color="white" />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  checkboxBase: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },
  checkIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: 'white',
    padding: 10,
  },
});
