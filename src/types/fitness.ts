import { z } from "zod";

export const ExerciseCategorySchema = z.enum([
  "CHEST",
  "BACK",
  "LEGS",
  "SHOULDERS",
  "ARMS",
  "CORE",
  "FULL_BODY",
  "CARDIO"
]);
export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>;

export const WorkoutSetSchema = z.object({
  setNumber: z.number().int().positive(),
  weightKg: z.number().min(0),
  reps: z.number().int().min(1).max(200),
  rpe: z.number().min(1).max(10).optional(), // Rate of Perceived Exertion (1-10)
  completed: z.boolean().default(true)
});
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;

export const ExerciseSessionSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string().min(1),
  category: ExerciseCategorySchema,
  sets: z.array(WorkoutSetSchema).min(1)
});
export type ExerciseSession = z.infer<typeof ExerciseSessionSchema>;

export const WorkoutSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().min(1),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive(),
  exercises: z.array(ExerciseSessionSchema),
  totalVolumeLoadKg: z.number().min(0),
  totalReps: z.number().int().min(0),
  averageHeartRateBpm: z.number().int().min(40).max(240).optional(),
  notes: z.string().optional()
});
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

/**
 * 1RM Estimation Breakdown
 */
export const OneRepMaxEstimateSchema = z.object({
  weightKg: z.number().positive(),
  reps: z.number().int().positive(),
  epleyKg: z.number().positive(),
  brzyckiKg: z.number().positive(),
  lombardiKg: z.number().positive(),
  average1RMKg: z.number().positive(),
  percentages: z.record(z.string(), z.number().positive()) // e.g. "90%": 135
});
export type OneRepMaxEstimate = z.infer<typeof OneRepMaxEstimateSchema>;

/**
 * Karvonen Heart Rate Zone Boundaries
 */
export const HeartRateZonesSchema = z.object({
  zone1Recovery: z.object({ minBpm: z.number(), maxBpm: z.number() }),
  zone2Aerobic: z.object({ minBpm: z.number(), maxBpm: z.number() }),
  zone3Tempo: z.object({ minBpm: z.number(), maxBpm: z.number() }),
  zone4Threshold: z.object({ minBpm: z.number(), maxBpm: z.number() }),
  zone5Anaerobic: z.object({ minBpm: z.number(), maxBpm: z.number() })
});
export type HeartRateZones = z.infer<typeof HeartRateZonesSchema>;
