"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch, getStoredToken } from "@/lib/api";

export function useResource<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setData(await apiFetch<T>(path, { token }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load data.");
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, reload: load };
}
