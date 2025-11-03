import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Task } from "@/components/ProgressContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Permissão para notificações não concedida!");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  try {
    await fetch("https://tasktamer-expo.onrender.com/users/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expoPushToken: token }),
    });
  } catch (err) {
    console.error("Erro ao enviar token para backend:", err);
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function scheduleTaskNotification(task: Task) {
  if (!task.date || task.done) return;

  const taskDate = new Date(task.date);
  const now = new Date();
  if (taskDate <= now) return;

  if (task.notificationId) {
    await cancelTaskNotification(task.notificationId);
  }

  const trigger = {
    seconds: (taskDate.getTime() - now.getTime()) / 1000,
    repeats: false,
  } as Notifications.TimeIntervalTriggerInput;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Lembrete: ${task.title}`,
      body: `Está na hora de realizar sua tarefa!`,
    },
    trigger,
  });

  return notificationId;
}

export async function cancelTaskNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
