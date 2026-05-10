import { describe, expect, it } from "vitest";
import { registerSchema, workoutCreateSchema } from "@fitplanner/shared";
import { calculateWorkoutStreak } from "../services/dashboard.service.js";

describe("shared validators", () => {
  it("rejects weak passwords during registration", () => {
    expect(() =>
      registerSchema.parse({
        name: "Ada",
        email: "ada@example.com",
        password: "123",
      }),
    ).toThrow();
  });

  it("accepts a valid workout payload", () => {
    const payload = workoutCreateSchema.parse({
      name: "Push A",
      description: "Chest and triceps",
      dayOfWeek: 1,
      exercises: [
        {
          exerciseId: "exercise-1",
          sets: 4,
          reps: 8,
          restSeconds: 120,
          targetWeight: 80,
          order: 0,
        },
      ],
    });

    expect(payload.exercises[0]?.sets).toBe(4);
  });
});

describe("dashboard streak calculation", () => {
  it("counts consecutive workout days from latest log date", () => {
    const streak = calculateWorkoutStreak([
      new Date("2026-05-05T10:00:00.000Z"),
      new Date("2026-05-04T10:00:00.000Z"),
      new Date("2026-05-03T10:00:00.000Z"),
      new Date("2026-05-01T10:00:00.000Z"),
    ]);

    expect(streak).toBe(3);
  });
});
