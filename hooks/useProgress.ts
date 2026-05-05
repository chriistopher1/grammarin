"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllUserProgress } from "@/lib/supabase/db";
import type { UserProgress } from "@/types";

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const all = await fetchAllUserProgress(userId);
      const map: Record<string, UserProgress> = {};
      all.forEach((p) => (map[p.grammar_id] = p));
      setProgress(map);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { progress, loading, refresh: load };
}