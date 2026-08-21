"use client";

import type { ColorOverrides, Resume } from "@/lib/types";
import { COLOR_ROLES } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import ColorField from "./ColorField";

type Patch = (fn: (draft: Resume) => void) => void;

/** The five document-wide colour roles. Per-section headings live in their own panels. */
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
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-600">Document colours</span>
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

      {COLOR_ROLES.map((role) => (
        <ColorField
          key={role.key}
          label={role.label}
          hint={role.hint}
          value={current(role.key)}
          isCustom={Boolean(overrides[role.key])}
          onChange={(hex) => set(role.key, hex)}
          onReset={() => set(role.key, null)}
        />
      ))}

      <p className="text-[11px] leading-relaxed text-slate-500">
        Anything left on <span className="font-medium">template</span> follows the design you pick, so
        switching templates still changes the whole look. Overridden roles stay put. To colour one
        section&rsquo;s heading differently, use the control inside that section&rsquo;s panel below.
      </p>
    </div>
  );
}
