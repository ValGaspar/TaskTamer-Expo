import { useEffect, useRef, useContext } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { ProgressContext, Task } from "@/components/ProgressContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  finish: () => void;
};

export default function AnimatedSplash({ finish }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { recalcProgress } = useContext(ProgressContext);

  useEffect(() => {
    const updateProgress = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const jsonValue = await AsyncStorage.getItem(`@tasks_${userId}`);
        const tasks: Task[] = jsonValue
          ? JSON.parse(jsonValue).map((t: Task) => ({
              ...t,
              date: t.date ? new Date(t.date) : undefined,
            }))
          : [];

        await recalcProgress(tasks, userId);
      } catch (e) {
        console.log("Erro ao atualizar progresso:", e);
      }
    };

    updateProgress();

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 600, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        finish();
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/TasktamerLogo.png")}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#98B88F",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
