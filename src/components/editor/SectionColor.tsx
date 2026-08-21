"use client";

import type { Resume, SectionId } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import ColorField from "./ColorField";

type Patch = (fn: (draft: Resume) => void) => void;

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

  function set(next: string | null) {
    patch((d) => {
      const map = { ...(d.settings.sectionColors ?? {}) };
      if (next) map[id] = next;
      else delete map[id];
      d.settings.sectionColors = map;
    });
  }

  return (
    <ColorField
      compact
      label={`${SECTION_LABELS[id]} heading`}
      hint={override ? "Custom — survives a template change" : "Following the document accent"}
      value={override ?? inherited}
      isCustom={Boolean(override)}
      onChange={(hex) => set(hex)}
      onReset={() => set(null)}
    />
  );
}
