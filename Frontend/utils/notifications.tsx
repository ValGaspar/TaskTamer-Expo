import * as Notifications from "expo-notifications";
import { Task } from "@/components/ProgressContext";

const motivationalMessages = [
  "Você consegue! 💪",
  "Dê só mais um passo hoje. 🌟",
  "Seu futuro agradece o esforço de agora.",
  "Não espere a motivação, crie o hábito. 🚀",
  "Pequenas ações geram grandes resultados!",
  "Você está mais perto do que imagina. 🙌",
  "Mantenha o foco, vale a pena. 🎯",
  "Só você pode fazer isso acontecer!",
  "Não precisa ser perfeito, só constante. 💚",
];

export async function scheduleDayNotifications(tasks: Task[]): Promise<void> {
  try {
    const now = new Date();

    await Notifications.cancelAllScheduledNotificationsAsync();

    const tasksByDay: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (t.done || !t.date) continue;
      const d = new Date(t.date);
      const dayKey = d.toDateString();
      if (!tasksByDay[dayKey]) tasksByDay[dayKey] = [];
      tasksByDay[dayKey].push(t);
    }

    for (const [dayKey, dayTasks] of Object.entries(tasksByDay)) {
      const taskDate = new Date(dayKey);
      if (taskDate <= now) continue;

      const reminderTime = new Date(taskDate);
      reminderTime.setDate(reminderTime.getDate() - 1);
      reminderTime.setHours(19, 0, 0, 0);

      if (reminderTime <= now) continue;

      const randomMessage =
        motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      const body =
        dayTasks.length === 1
          ? `Você tem uma tarefa em ${taskDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}: ${dayTasks[0].title}. ${randomMessage}`
          : `Você tem ${dayTasks.length} tarefas para ${taskDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}. ${randomMessage}`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete 📅",
          body,
          sound: true,
        },
        trigger: { date: reminderTime } as Notifications.DateTriggerInput,
      });
    }

    console.log("Notificações diárias agendadas com sucesso!");
  } catch (err) {
    console.warn("Erro ao agendar notificações diárias:", err);
  }
}
