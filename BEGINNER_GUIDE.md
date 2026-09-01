# 🎓 Pulse Fitness Tracker & Biometrics — Beginner's Learning Guide

## What This Project Does
**pulse-fitness-tracker** is a biometric strength and endurance analytics platform, progressive overload volume engine, 1RM estimator, and metabolic heart rate zone calculator built with TypeScript and Zod validation.

---

## 🗺️ Architecture Map

```
FITNESS DOMAIN & BIOMETRIC SCHEMAS
  │  (src/types/fitness.ts - Workouts, Heart Rate Zones, 1RM Ingestion Schemas)
  ▼
BIOMETRIC & EXERCISE ANALYTICS ENGINE
  │  ├── 1RM Estimators (Brzycki, Epley, Lombardi, O'Conner) (src/services/analyticsEngine.ts)
  │  ├── Progressive Overload Volume Load Calculator
  │  └── Karvonen & Tanaka Heart Rate Training Zones
  ▼
REACTIVE UI COMPONENTS & HOOKS
  │  ├── useFitness (src/hooks/useFitness.ts)
  │  └── fitnessFormatters (src/utils/fitnessFormatters.ts)
  ▼
UNIT TEST & INVARIANT SUITE
     (tests/analyticsEngine.test.ts - Vitest Mathematical Precision & Metabolic Invariants)
```

---

## 🎯 Core Files to Study First (Recommended Learning Order)

1. [`src/services/analyticsEngine.ts`](file:///C:/Users/tinif/repos/pulse-fitness-tracker/src/services/analyticsEngine.ts)
   - **Why study first**: Teaches exercise physiology mathematical formulas (1RM estimation, volume load accumulation, heart rate reserve zones).
2. [`src/types/fitness.ts`](file:///C:/Users/tinif/repos/pulse-fitness-tracker/src/types/fitness.ts)
   - **Why study next**: Shows how Zod defines strict workout schemas and intensity targets.
3. [`tests/analyticsEngine.test.ts`](file:///C:/Users/tinif/repos/pulse-fitness-tracker/tests/analyticsEngine.test.ts)
   - **Why study third**: Demonstrates comprehensive test coverage for metabolic and biomechanical calculation engines.

---

## 🛠️ How to Run & Verify

```bash
npm test
npm run typecheck
npm run build
```
