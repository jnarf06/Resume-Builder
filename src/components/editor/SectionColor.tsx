"use client";

import type { Resume, SectionId } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";

type Patch = (fn: (draft: Resume) => void) => void;

const PRESETS = [
  "#0f172a",
  "#1f3a5f",
  "#075985",
  "#0f766e",
  "#14532d",
  "#854d0e",
  "#9a3412",
  "#7f1d1d",
  "#831843",
  "#4c1d95",
];

/**
 * Heading colour for one section. Sits inside that section's panel rather than
 * in a global palette, so the control is where the thing it changes is.
 * Unset means "follow the document accent".
 */
export default function SectionColor({
  r,
  patch,
  id,
}: {
  r: Resume;
  patch: Patch;
  id: SectionId;
}) {
  const spec = getTemplate(r.settings.template);
  const override = r.settings.sectionColors?.[id];
  const inherited = r.settings.colors?.accent || r.settings.accent || spec.tokens.accent;
  const value = override ?? inherited;

  function set(next: string | null) {
    patch((d) => {
      const map = { ...(d.settings.sectionColors ?? {}) };
      if (next) map[id] = next;
      else delete map[id];
      d.settings.sectionColors = map;
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
      <div className="flex items-center gap-2">
        <label className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-slate-300">
          <span className="block h-full w-full" style={{ backgroundColor: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => set(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`${SECTION_LABELS[id]} heading colour`}
          />
        </label>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-slate-700">
            {SECTION_LABELS[id]} heading colour
          </p>
          <p className="text-[10px] text-slate-400">
            {override ? "Custom — stays put when you change template" : "Following the document accent"}
          </p>
        </div>

        {override && (
          <button
            type="button"
            onClick={() => set(null)}
            className="shrink-0 rounded border border-slate-300 px-1.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => set(c)}
            aria-label={c}
            className={`h-4 w-4 rounded-full border transition ${
              override?.toLowerCase() === c
                ? "border-slate-800 ring-2 ring-slate-300"
                : "border-slate-300 hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
