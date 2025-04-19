// components/lottieLoading.js
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieLoading() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/loading.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98B88F',
    zIndex: 1000, // Ensure it's on top
  },
  animation: {
    width: 200,
    height: 200,
  },
});