import { useState, useCallback } from "react";
import { type ExerciseSession, type WorkoutSession } from "../types/fitness";
import { processWorkoutSession } from "../services/analyticsEngine";

export function useWorkoutTracker(userId: string) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeExercises, setActiveExercises] = useState<ExerciseSession[]>([]);
  const [activeStartTime, setActiveStartTime] = useState<number | null>(null);

  const startWorkout = useCallback(() => {
    setActiveStartTime(Date.now());
    setActiveExercises([]);
  }, []);

  const addExerciseSession = useCallback((exercise: ExerciseSession) => {
    setActiveExercises((prev) => [...prev, exercise]);
  }, []);

  const finishWorkout = useCallback(
    (sessionId: string, title: string, avgHeartRate?: number) => {
      if (!activeStartTime) return null;
      const endTime = Date.now();
      const session = processWorkoutSession(
        sessionId,
        userId,
        title,
        activeStartTime,
        endTime,
        activeExercises,
        avgHeartRate
      );

      setSessions((prev) => [session, ...prev]);
      setActiveStartTime(null);
      setActiveExercises([]);
      return session;
    },
    [activeStartTime, activeExercises, userId]
  );

  return {
    sessions,
    activeExercises,
    isWorkoutActive: activeStartTime !== null,
    startWorkout,
    addExerciseSession,
    finishWorkout
  };
}
