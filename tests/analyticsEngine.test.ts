import { describe, it, expect } from "vitest";
import {
  calculateOneRepMax,
  calculateVolumeLoad,
  calculateKarvonenHeartRateZones,
  processWorkoutSession
} from "../src/services/analyticsEngine";
import {
  WorkoutSessionSchema,
  OneRepMaxEstimateSchema
} from "../src/types/fitness";

describe("Pulse Fitness Analytics Calculation Engine", () => {
  describe("One Rep Max (1RM) Estimations", () => {
    it("should return the exact weight as 1RM when reps == 1", () => {
      const estimate = calculateOneRepMax(140, 1);
      expect(estimate.average1RMKg).toBe(140);
      expect(estimate.epleyKg).toBe(140);
      expect(estimate.brzyckiKg).toBe(140);
      expect(estimate.percentages["90%"]).toBe(126);
    });

    it("should compute consensus 1RM for multiple reps (100kg x 5 reps)", () => {
      const estimate = calculateOneRepMax(100, 5);

      // Epley: 100 * (1 + 5/30) = 116.67
      // Brzycki: 100 * (36 / 32) = 112.5
      // Lombardi: 100 * 5^0.1 = 117.46
      expect(estimate.epleyKg).toBeCloseTo(116.7, 1);
      expect(estimate.brzyckiKg).toBeCloseTo(112.5, 1);
      expect(estimate.average1RMKg).toBeGreaterThan(110);
      expect(estimate.average1RMKg).toBeLessThan(120);
      expect(() => OneRepMaxEstimateSchema.parse(estimate)).not.toThrow();
    });

    it("should throw error when non-positive weight or reps are provided", () => {
      expect(() => calculateOneRepMax(0, 5)).toThrow();
      expect(() => calculateOneRepMax(100, 0)).toThrow();
    });
  });

  describe("Volume Load Math", () => {
    it("should compute cumulative volume load from completed sets only", () => {
      const sets = [
        { setNumber: 1, weightKg: 100, reps: 10, completed: true },
        { setNumber: 2, weightKg: 100, reps: 8, completed: true },
        { setNumber: 3, weightKg: 120, reps: 5, completed: false } // Did not complete
      ];

      const result = calculateVolumeLoad(sets);
      expect(result.totalVolumeLoadKg).toBe(1800); // (100*10) + (100*8)
      expect(result.totalReps).toBe(18);
      expect(result.completedSetsCount).toBe(2);
    });
  });

  describe("Karvonen Heart Rate Target Zones", () => {
    it("should compute 5 HR zones accurately from resting and max heart rate", () => {
      const zones = calculateKarvonenHeartRateZones(60, 200);
      // HRR = 140
      // Zone 1: 60 + 140*0.5 to 60 + 140*0.6 => 130 to 144
      expect(zones.zone1Recovery.minBpm).toBe(130);
      expect(zones.zone1Recovery.maxBpm).toBe(144);
      expect(zones.zone5Anaerobic.maxBpm).toBe(200);
    });

    it("should throw on invalid heart rate thresholds", () => {
      expect(() => calculateKarvonenHeartRateZones(190, 180)).toThrow();
    });
  });

  describe("End-to-End Workout Session Aggregation", () => {
    it("should aggregate session with exercises and calculate total volume load", () => {
      const session = processWorkoutSession(
        "123e4567-e89b-12d3-a456-426614174000",
        "user-001",
        "Chest & Triceps Day",
        1700000000000,
        1700003600000,
        [
          {
            exerciseId: "bench-press",
            exerciseName: "Barbell Bench Press",
            category: "CHEST",
            sets: [
              { setNumber: 1, weightKg: 80, reps: 10, completed: true },
              { setNumber: 2, weightKg: 90, reps: 8, completed: true }
            ]
          }
        ],
        135
      );

      expect(session.totalVolumeLoadKg).toBe(80 * 10 + 90 * 8); // 800 + 720 = 1520
      expect(session.totalReps).toBe(18);
      expect(() => WorkoutSessionSchema.parse(session)).not.toThrow();
    });
  });
});
