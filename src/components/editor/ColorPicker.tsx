"use client";

import type { ColorOverrides, Resume } from "@/lib/types";
import { COLOR_ROLES } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";

type Patch = (fn: (draft: Resume) => void) => void;

/** Quick picks. The native colour input covers everything else. */
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
  "#334155",
  "#ffffff",
];

export default function ColorPicker({ r, patch }: { r: Resume; patch: Patch }) {
  const spec = getTemplate(r.settings.template);
  const overrides: ColorOverrides = r.settings.colors ?? {};

  /** What the page is actually using for a role right now. */
  function current(key: keyof ColorOverrides): string {
    if (overrides[key]) return overrides[key] as string;
    if (key === "accent") return r.settings.accent || spec.tokens.accent;
    if (key === "page") return spec.tokens.pageBg;
    return spec.tokens[key as "surface" | "ink" | "onAccent"];
  }

  function set(key: keyof ColorOverrides, value: string | null) {
    patch((d) => {
      const next = { ...(d.settings.colors ?? {}) };
      if (value) next[key] = value;
      else delete next[key];
      d.settings.colors = next;
      // The pre-overrides field would otherwise keep winning for accent.
      if (key === "accent") d.settings.accent = "";
    });
  }

  const customCount = Object.keys(overrides).length;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-600">Colours</span>
        {customCount > 0 && (
          <button
            type="button"
            onClick={() =>
              patch((d) => {
                d.settings.colors = {};
                d.settings.accent = "";
              })
            }
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800"
          >
            Reset all to template
          </button>
        )}
      </div>

      {COLOR_ROLES.map((role) => {
        const value = current(role.key);
        const isCustom = Boolean(overrides[role.key]);
        return (
          <div key={role.key} className="rounded-lg border border-slate-200 p-2.5">
            <div className="flex items-center gap-2">
              <label className="relative h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded border border-slate-300">
                <span className="block h-full w-full" style={{ backgroundColor: value }} />
                <input
                  type="color"
                  value={value}
                  onChange={(e) => set(role.key, e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={`${role.label} colour`}
                />
              </label>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  {role.label}
                  {!isCustom && <span className="ml-1.5 font-normal text-slate-400">template</span>}
                </p>
                <p className="truncate text-[11px] text-slate-500">{role.hint}</p>
              </div>

              {isCustom && (
                <button
                  type="button"
                  onClick={() => set(role.key, null)}
                  title="Back to the template's colour"
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
                  onClick={() => set(role.key, c)}
                  aria-label={c}
                  className={`h-5 w-5 rounded-full border transition ${
                    value.toLowerCase() === c
                      ? "border-slate-800 ring-2 ring-slate-300"
                      : "border-slate-300 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-[11px] leading-relaxed text-slate-500">
        Anything left on <span className="font-medium">template</span> follows the design you pick, so
        switching templates still changes the whole look. Overridden roles stay put. To colour one
        section&rsquo;s heading differently, use the colour control inside that section&rsquo;s panel
        below.
      </p>
    </div>
  );
}
