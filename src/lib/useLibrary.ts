"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Resume } from "./types";
import { bootstrap, saveAll } from "./storage";

/**
 * False during SSR and hydration, true immediately after — so the server HTML
 * and the first client render agree, and stored resumes only appear once
 * hydration is safely past. No setState-in-an-effect required.
 */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** bootstrap() touches localStorage, so run it once and only in the browser. */
let cachedInit: { list: Resume[]; activeId: string } | null = null;

export function initialLibrary() {
  if (typeof window === "undefined") return { list: [] as Resume[], activeId: "" };
  cachedInit ??= bootstrap();
  return cachedInit;
}

/**
 * The resume library, shared by the dashboard and the editor: hydrated from
 * localStorage after mount, autosaved 400ms after the last change so typing
 * does not hit storage on every keystroke.
 */
export function useLibrary() {
  const ready = useMounted();
  const [list, setList] = useState<Resume[]>(() => initialLibrary().list);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      saveAll(list);
      setSavedAt(Date.now());
      // Keep the module cache in step so navigating between pages does not
      // re-read stale data from the first bootstrap.
      cachedInit = { list, activeId: cachedInit?.activeId ?? "" };
    }, 400);
    return () => clearTimeout(t);
  }, [list, ready]);

  return { list, setList, ready, savedAt };
}

/** Human-readable "last edited" without pulling in a date library. */
export function timeAgo(ts: number): string {
  if (!ts) return "never";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleDateString();
}
