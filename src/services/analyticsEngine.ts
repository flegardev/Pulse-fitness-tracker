import {
  type ExerciseSession,
  type HeartRateZones,
  type OneRepMaxEstimate,
  type WorkoutSession,
  type WorkoutSet
} from "../types/fitness";

/**
 * Calculates Estimated One Rep Max (1RM) using Epley, Brzycki, and Lombardi formulas
 */
export function calculateOneRepMax(weightKg: number, reps: number): OneRepMaxEstimate {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isSafeInteger(reps) || reps <= 0) {
    throw new Error("Weight must be finite and positive; reps must be a positive whole number.");
  }

  if (reps === 1) {
    const percentages: Record<string, number> = {
      "100%": weightKg,
      "95%": Number((weightKg * 0.95).toFixed(1)),
      "90%": Number((weightKg * 0.9).toFixed(1)),
      "85%": Number((weightKg * 0.85).toFixed(1)),
      "80%": Number((weightKg * 0.8).toFixed(1)),
      "75%": Number((weightKg * 0.75).toFixed(1)),
      "70%": Number((weightKg * 0.7).toFixed(1))
    };

    return {
      weightKg,
      reps,
      epleyKg: weightKg,
      brzyckiKg: weightKg,
      lombardiKg: weightKg,
      average1RMKg: weightKg,
      percentages
    };
  }

  // 1. Epley formula: w * (1 + r / 30)
  const epley = weightKg * (1 + reps / 30);

  // 2. Brzycki formula: w * (36 / (37 - r))
  // Brzycki is valid for reps < 37
  const brzycki = reps < 37 ? weightKg * (36 / (37 - reps)) : epley;

  // 3. Lombardi formula: w * (r ^ 0.10)
  const lombardi = weightKg * Math.pow(reps, 0.1);

  const average = (epley + brzycki + lombardi) / 3;

  const average1RMKg = Number(average.toFixed(1));
  const epleyKg = Number(epley.toFixed(1));
  const brzyckiKg = Number(brzycki.toFixed(1));
  const lombardiKg = Number(lombardi.toFixed(1));

  const percentages: Record<string, number> = {
    "100%": average1RMKg,
    "95%": Number((average1RMKg * 0.95).toFixed(1)),
    "90%": Number((average1RMKg * 0.9).toFixed(1)),
    "85%": Number((average1RMKg * 0.85).toFixed(1)),
    "80%": Number((average1RMKg * 0.8).toFixed(1)),
    "75%": Number((average1RMKg * 0.75).toFixed(1)),
    "70%": Number((average1RMKg * 0.7).toFixed(1))
  };

  return {
    weightKg,
    reps,
    epleyKg,
    brzyckiKg,
    lombardiKg,
    average1RMKg,
    percentages
  };
}

/**
 * Calculates total volume load (kg) and total reps for a collection of exercise sets
 */
export function calculateVolumeLoad(sets: readonly WorkoutSet[]): {
  totalVolumeLoadKg: number;
  totalReps: number;
  completedSetsCount: number;
} {
  let totalVolumeLoadKg = 0;
  let totalReps = 0;
  let completedSetsCount = 0;

  for (const s of sets) {
    if (s.completed) {
      totalVolumeLoadKg += s.weightKg * s.reps;
      totalReps += s.reps;
      completedSetsCount += 1;
    }
  }

  return {
    totalVolumeLoadKg: Number(totalVolumeLoadKg.toFixed(1)),
    totalReps,
    completedSetsCount
  };
}

/**
 * Calculates Heart Rate Training Zones using the Karvonen Formula (Heart Rate Reserve)
 */
export function calculateKarvonenHeartRateZones(
  restingHeartRateBpm: number,
  maxHeartRateBpm: number
): HeartRateZones {
  if (!Number.isFinite(restingHeartRateBpm) || !Number.isFinite(maxHeartRateBpm) ||
      restingHeartRateBpm >= maxHeartRateBpm || restingHeartRateBpm < 30 || maxHeartRateBpm > 240) {
    throw new Error("Invalid heart rate parameters supplied.");
  }

  const hrr = maxHeartRateBpm - restingHeartRateBpm; // Heart Rate Reserve

  const zoneCalc = (intensityMin: number, intensityMax: number) => ({
    minBpm: Math.round(restingHeartRateBpm + hrr * intensityMin),
    maxBpm: Math.round(restingHeartRateBpm + hrr * intensityMax)
  });

  return {
    zone1Recovery: zoneCalc(0.5, 0.6), // 50-60% HRR
    zone2Aerobic: zoneCalc(0.6, 0.7), // 60-70% HRR
    zone3Tempo: zoneCalc(0.7, 0.8), // 70-80% HRR
    zone4Threshold: zoneCalc(0.8, 0.9), // 80-90% HRR
    zone5Anaerobic: zoneCalc(0.9, 1.0) // 90-100% HRR
  };
}

/**
 * Aggregates workout session details and validates totals
 */
export function processWorkoutSession(
  id: string,
  userId: string,
  title: string,
  startTime: number,
  endTime: number,
  exercises: readonly ExerciseSession[],
  averageHeartRateBpm?: number
): WorkoutSession {
  let totalVolumeLoadKg = 0;
  let totalReps = 0;

  for (const ex of exercises) {
    const vol = calculateVolumeLoad(ex.sets);
    totalVolumeLoadKg += vol.totalVolumeLoadKg;
    totalReps += vol.totalReps;
  }

  return {
    id,
    userId,
    title,
    startTime,
    endTime,
    exercises: [...exercises],
    totalVolumeLoadKg: Number(totalVolumeLoadKg.toFixed(1)),
    totalReps,
    ...(averageHeartRateBpm ? { averageHeartRateBpm } : {})
  };
}
