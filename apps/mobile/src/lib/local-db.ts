import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

async function getDatabase() {
  database ??= await SQLite.openDatabaseAsync("fitplanner.db");
  return database;
}

export async function initializeLocalDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_logs_cache (
      id TEXT PRIMARY KEY NOT NULL,
      workout_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS body_progress_cache (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function cacheWorkoutLog(workoutId: string, payload: unknown) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO workout_logs_cache (id, workout_id, payload, created_at) VALUES (?, ?, ?, ?)",
    `${workoutId}-${Date.now()}`,
    workoutId,
    JSON.stringify(payload),
    new Date().toISOString(),
  );
}
