import type { DefaultWorkoutType, MuscleGroup } from "@fitplanner/shared";

const muscleImages = {
  Chest: require("../../assets/images/muscles/chest.png"),
  Back: require("../../assets/images/muscles/back.png"),
  Legs: require("../../assets/images/muscles/legs.png"),
  Shoulders: require("../../assets/images/muscles/shoulders.png"),
  Biceps: require("../../assets/images/muscles/biceps.png"),
  Triceps: require("../../assets/images/muscles/triceps.png"),
  Core: require("../../assets/images/muscles/core.png"),
  "Full Body": require("../../assets/images/muscles/full-body.png"),
} satisfies Record<MuscleGroup, number>;

const trainingTypeImages = {
  Strength: require("../../assets/images/training/strength.png"),
  Hypertrophy: require("../../assets/images/training/hypertrophy.png"),
  Cardio: require("../../assets/images/training/cardio.png"),
  Mobility: require("../../assets/images/training/mobility.png"),
  HIIT: require("../../assets/images/training/hiit.png"),
} satisfies Record<DefaultWorkoutType, number>;

export function getMuscleImage(group?: string | null) {
  return muscleImages[group as MuscleGroup] ?? muscleImages["Full Body"];
}

export function getTrainingTypeImage(type?: string | null) {
  return trainingTypeImages[type as DefaultWorkoutType] ?? trainingTypeImages.Strength;
}
