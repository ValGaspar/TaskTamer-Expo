import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Task = {
  id: string;
  title: string;
  done?: boolean;
  date?: Date;
  userId: string;
};

export type ProgressData = {
  completed: number;
  remaining: number;
  percentage: number;
};

type ProgressContextType = {
  streak: number;
  totalDays: number;
  progressData: ProgressData;
  recalcProgress: (tasks: Task[], userId: string) => Promise<void>;
};

export const ProgressContext = createContext<ProgressContextType>({
  streak: 0,
  totalDays: 0,
  progressData: { completed: 0, remaining: 0, percentage: 0 },
  recalcProgress: async () => { },
});

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [progressData, setProgressData] = useState<ProgressData>({ completed: 0, remaining: 0, percentage: 0 });

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const recalcProgress = async (tasks: Task[] = [], userId: string) => {
    if (!userId) return;

    const streakKey = `streak_${userId}`;
    const totalDaysKey = `totalDays_${userId}`;
    const lastAccessKey = `lastAccess_${userId}`;

    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];

    const lastAccessDateStr = await AsyncStorage.getItem(lastAccessKey);
    let newStreak = parseInt((await AsyncStorage.getItem(streakKey)) || "0");
    let newTotal = parseInt((await AsyncStorage.getItem(totalDaysKey)) || "0");

    const todayTasks = tasks.filter(
      t => t.userId === userId && t.date && isSameDay(new Date(t.date), today)
    );

    if (todayTasks.length > 0) {
      const allDone = todayTasks.every(t => t.done);
      if (allDone && lastAccessDateStr !== todayKey) {
        if (lastAccessDateStr) {
          const lastAccess = new Date(lastAccessDateStr);
          const diffDays = (today.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
          newStreak = diffDays <= 1.5 ? newStreak + 1 : 1;
        } else {
          newStreak = 1;
        }
        newTotal++;
        await AsyncStorage.setItem(streakKey, newStreak.toString());
        await AsyncStorage.setItem(totalDaysKey, newTotal.toString());
        await AsyncStorage.setItem(lastAccessKey, todayKey);
      }
    }

    setStreak(newStreak);
    setTotalDays(newTotal);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // domingo
    const weekTasks = tasks.filter(t => {
      const taskDate = new Date(t.date!);
      return taskDate >= weekStart && t.userId === userId;
    });

    const completed = weekTasks.filter(t => t.done).length;
    const remaining = weekTasks.length - completed;
    const percentage = weekTasks.length === 0 ? 0 : Math.round((completed / weekTasks.length) * 100);

    setProgressData({ completed, remaining, percentage });
  };

  const loadProgress = async (userId: string) => {
    if (!userId) return;
    const savedStreak = parseInt((await AsyncStorage.getItem(`streak_${userId}`)) || "0");
    const savedTotal = parseInt((await AsyncStorage.getItem(`totalDays_${userId}`)) || "0");
    setStreak(savedStreak);
    setTotalDays(savedTotal);
  };

  useEffect(() => {
    const init = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) loadProgress(userId);
    };
    init();
  }, []);

  return (
    <ProgressContext.Provider value={{ streak, totalDays, progressData, recalcProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
