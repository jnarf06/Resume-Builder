"use client";

import { useState } from "react";

const SKIP_KEY = "rb.skipPrintTips.v1";

/**
 * A pre-flight checklist shown before handing off to the browser's print
 * dialog.
 *
 * Chrome's print options — margins, headers and footers, background graphics —
 * are user preferences with no web API behind them. A page cannot read or set
 * them. All we can do is say plainly what to pick, once, and let people turn
 * the reminder off: Chrome remembers the settings afterwards.
 */
export function shouldShowPrintTips(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SKIP_KEY) !== "1";
}

export default function PrintDialog({ onClose }: { onClose: () => void }) {
  const [skip, setSkip] = useState(false);

  function go() {
    if (skip && typeof window !== "undefined") window.localStorage.setItem(SKIP_KEY, "1");
    onClose();
    // Let the modal unmount before the dialog steals the thread, or it is
    // captured in the printed output.
    setTimeout(() => window.print(), 60);
  }

  return (
    <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <h2 className="text-base font-bold text-slate-900">Three settings in the print dialog</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Your browser owns these, so the page cannot set them for you. Chrome remembers your choice,
          so this is a one-time job.
        </p>

        <ul className="mt-4 space-y-2.5">
          <Row state="set" label="Destination" value="Save as PDF" />
          <Row
            state="set"
            label="Margins"
            value="Default"
            note="Not None — the page margins come from the stylesheet, and None discards them."
          />
          <Row
            state="tick"
            label="Background graphics"
            value="ticked"
            note="Off means no coloured header, no sidebar tint — a white page."
          />
          <Row
            state="untick"
            label="Headers and footers"
            value="unticked"
            note="Otherwise Chrome prints the date and page URL onto your resume."
          />
        </ul>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={skip}
            onChange={(e) => setSkip(e.target.checked)}
            className="h-3.5 w-3.5 accent-slate-700"
          />
          Do not show this again
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={go}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Open print dialog
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  state,
  label,
  value,
  note,
}: {
  state: "set" | "tick" | "untick";
  label: string;
  value: string;
  note?: string;
}) {
  const box =
    state === "untick" ? (
      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border border-slate-400 bg-white" />
    ) : (
      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-slate-800 text-[10px] font-bold text-white">
        ✓
      </span>
    );

  return (
    <li className="flex gap-2.5">
      {box}
      <div className="min-w-0">
        <p className="text-sm text-slate-800">
          <span className="font-semibold">{label}</span>
          {" — "}
          <span className={state === "untick" ? "text-red-600" : "text-emerald-700"}>{value}</span>
        </p>
        {note && <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{note}</p>}
      </div>
    </li>
  );
}
