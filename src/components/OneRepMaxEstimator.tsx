import React, { useState, useMemo } from "react";
import { calculateOneRepMax } from "../services/analyticsEngine";
import { formatWeight } from "../utils/fitnessFormatters";

export const OneRepMaxEstimator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);

  const estimate = useMemo(() => {
    if (weightKg <= 0 || reps <= 0) return null;
    return calculateOneRepMax(weightKg, reps);
  }, [weightKg, reps]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1RM Strength Calculator</h2>
          <p className="text-xs text-slate-500">Multi-formula Epley, Brzycki & Lombardi consensus model</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lifted-weight-input" className="block text-xs font-semibold text-slate-500 mb-1">Lifted Weight (kg)</label>
          <input
            id="lifted-weight-input"
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold font-mono"
          />
        </div>
        <div>
          <label htmlFor="reps-performed-input" className="block text-xs font-semibold text-slate-500 mb-1">Reps Performed</label>
          <input
            id="reps-performed-input"
            type="number"
            value={reps}
            min={1}
            max={30}
            onChange={(e) => setReps(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold font-mono"
          />
        </div>
      </div>

      {estimate && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Estimated 1 Rep Max
            </span>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-300 mt-1 font-mono">
              {formatWeight(estimate.average1RMKg)}
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
              <span>Epley: {estimate.epleyKg}kg</span>
              <span>Brzycki: {estimate.brzyckiKg}kg</span>
              <span>Lombardi: {estimate.lombardiKg}kg</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(estimate.percentages).map(([pct, kg]) => (
              <div key={pct} className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center">
                <div className="text-[11px] font-bold text-slate-400">{pct}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{kg} kg</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
