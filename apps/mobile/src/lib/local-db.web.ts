const workoutLogCacheKey = "fitplanner.workoutLogs.cache";

export async function initializeLocalDatabase() {
  return Promise.resolve();
}

export async function cacheWorkoutLog(workoutId: string, payload: unknown) {
  if (typeof window === "undefined") return;

  const current = JSON.parse(window.localStorage.getItem(workoutLogCacheKey) ?? "[]") as unknown[];
  current.unshift({
    id: `${workoutId}-${Date.now()}`,
    workoutId,
    payload,
    createdAt: new Date().toISOString(),
  });

  window.localStorage.setItem(workoutLogCacheKey, JSON.stringify(current.slice(0, 20)));
}
