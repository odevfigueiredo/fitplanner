import type { MuscleGroup, WorkoutType } from "@fitplanner/shared";

export const muscleImageMap: Record<MuscleGroup, string> = {
  Chest: "/assets/muscles/chest.png",
  Back: "/assets/muscles/back.png",
  Legs: "/assets/muscles/legs.png",
  Shoulders: "/assets/muscles/shoulders.png",
  Biceps: "/assets/muscles/biceps.png",
  Triceps: "/assets/muscles/triceps.png",
  Core: "/assets/muscles/core.png",
  "Full Body": "/assets/muscles/full-body.png",
};

export const trainingTypeImageMap: Record<WorkoutType, string> = {
  Strength: "/assets/training/strength.png",
  Hypertrophy: "/assets/training/hypertrophy.png",
  Cardio: "/assets/training/cardio.png",
  Mobility: "/assets/training/mobility.png",
  HIIT: "/assets/training/hiit.png",
};

export function getMuscleImage(group?: string | null) {
  return muscleImageMap[group as MuscleGroup] ?? muscleImageMap["Full Body"];
}

export function getTrainingTypeImage(type?: string | null) {
  return trainingTypeImageMap[type as WorkoutType] ?? trainingTypeImageMap.Strength;
}
