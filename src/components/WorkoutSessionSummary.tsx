import React from "react";
import { type WorkoutSession } from "../types/fitness";
import { formatWorkoutDuration, formatWeight } from "../utils/fitnessFormatters";

export interface WorkoutSessionSummaryProps {
  session: WorkoutSession;
}

export const WorkoutSessionSummary: React.FC<WorkoutSessionSummaryProps> = ({ session }) => {
  const durationSeconds = Math.max(0, Math.floor((session.endTime - session.startTime) / 1000));

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{session.title}</h2>
          <p className="text-xs text-slate-500 font-mono">Session ID: {session.id}</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full">
          Completed
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="text-xs text-slate-400">Total Volume</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {formatWeight(session.totalVolumeLoadKg)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="text-xs text-slate-400">Total Reps</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {session.totalReps}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="text-xs text-slate-400">Duration</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {formatWorkoutDuration(durationSeconds)}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exercises ({session.exercises.length})</h3>
        <div className="space-y-1.5">
          {session.exercises.map((ex, i) => (
            <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{ex.exerciseName}</span>
              <span className="text-slate-500">{ex.sets.length} sets</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
