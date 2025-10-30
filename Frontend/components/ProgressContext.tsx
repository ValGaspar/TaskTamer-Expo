import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Task = {
  id: string;
  title: string;
  done?: boolean;
  date?: Date;
  userId: string;
};

type ProgressContextType = {
  streak: number;
  totalDays: number;
  recalcProgress: (tasks: Task[], userId: string) => Promise<void>;
};

export const ProgressContext = createContext<ProgressContextType>({
  streak: 0,
  totalDays: 0,
  recalcProgress: async () => { },
});

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

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

    if (todayTasks.length === 0) return;

   const allDone = todayTasks.every(t => t.done);
    if (!allDone) return;

    if (lastAccessDateStr === todayKey) return;

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

    setStreak(newStreak);
    setTotalDays(newTotal);
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
    <ProgressContext.Provider value={{ streak, totalDays, recalcProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
