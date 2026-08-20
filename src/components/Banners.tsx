"use client";

import { useState } from "react";
import type { Resume } from "@/lib/types";
import { exportJson, lastExportedAt, storageAvailable } from "@/lib/storage";
import { useMounted } from "@/lib/useLibrary";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Without accounts, two failure modes can quietly destroy someone's work:
 * storage that silently refuses writes (private browsing, locked-down
 * profiles), and clearing site data with no backup. Neither announces itself,
 * so the app has to.
 */

export function StorageBanner() {
  const mounted = useMounted();
  if (!mounted || storageAvailable()) return null;

  return (
    <div className="border-b border-red-200 bg-red-50 px-6 py-2.5">
      <div className="mx-auto flex max-w-6xl items-start gap-2 text-xs text-red-800">
        <span className="font-bold">Nothing is being saved.</span>
        <span className="leading-relaxed">
          This browser is blocking local storage — private/incognito mode, or a restricted profile.
          Your work will disappear when you close this tab. Use{" "}
          <span className="font-semibold">Export</span> to download a copy before you leave, or open
          the app in a normal window.
        </span>
      </div>
    </div>
  );
}

export function BackupBanner({ list }: { list: Resume[] }) {
  const mounted = useMounted();
  const [dismissed, setDismissed] = useState(false);
  // Captured once on mount: reading the clock during render is impure, and the
  // banner does not need the time to tick.
  const [now] = useState(() => Date.now());

  if (!mounted || dismissed || list.length === 0) return null;

  const exportedAt = lastExportedAt();
  const newestEdit = Math.max(...list.map((r) => r.updatedAt));
  const staleBackup = newestEdit > exportedAt;
  const oldEnough = now - newestEdit < 30 * DAY;

  // Only nag about work that is both unbacked-up and recent enough to care about.
  if (!staleBackup || !oldEnough) return null;

  const newest = [...list].sort((a, b) => b.updatedAt - a.updatedAt)[0];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="min-w-0 flex-1 text-xs leading-relaxed text-amber-900">
        <span className="font-semibold">
          {exportedAt ? "Changes since your last backup." : "No backup yet."}
        </span>{" "}
        Resumes live only in this browser. Clearing site data, or switching to another device, loses
        them. A JSON export takes a second and imports anywhere.
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => exportJson(newest)}
          className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
        >
          Back up “{newest.docName.slice(0, 24)}”
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md border border-amber-300 px-2.5 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
        >
          Later
        </button>
      </div>
    </div>
  );
}
