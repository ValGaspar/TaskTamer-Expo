import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Task } from "@/components/ProgressContext"; // seu tipo de Task

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permissão para notificações não concedida!");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Token do dispositivo:", token);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      seconds: 2,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });
}

// -------------------------
// NOVAS FUNÇÕES PARA TASKS
// -------------------------

// Agenda notificação para uma tarefa
export async function scheduleTaskNotification(task: Task) {
  if (!task.date || task.done) return;

  const taskDate = new Date(task.date);
  const now = new Date();

  if (taskDate <= now) return;

  // Cancelar notificação antiga se existir
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

  return notificationId; // salva este ID junto com a tarefa
}

// Cancela uma notificação agendada
export async function cancelTaskNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
