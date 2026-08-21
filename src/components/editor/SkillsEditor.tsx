"use client";

import { useState } from "react";
import type { Resume, Skill } from "@/lib/types";
import { uid } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import { Button, ItemControls } from "./Fields";

type Patch = (fn: (draft: Resume) => void) => void;

function move<T>(arr: T[], from: number, to: number) {
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
}

/** Safety net for a long list; the new row sits under the button already. */
function reveal(id: string) {
  setTimeout(() => {
    document.getElementById(`item-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, 0);
}

/** Clickable 1–5 rating. Clicking the active value clears it back to unrated. */
function Rating({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} of 5`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(value === n ? null : n)}
          className="p-0.5 leading-none"
        >
          <span
            className={`block h-3.5 w-3.5 rounded-full border transition ${
              n <= shown
                ? "border-slate-700 bg-slate-700"
                : "border-slate-300 bg-white hover:border-slate-500"
            }`}
          />
        </button>
      ))}
      <span className="ml-1 w-12 shrink-0 text-[10px] text-slate-400">
        {value === null ? "unrated" : `${value}/5`}
      </span>
    </div>
  );
}

export default function SkillsEditor({ r, patch }: { r: Resume; patch: Patch }) {
  const [bulk, setBulk] = useState(false);
  const [draft, setDraft] = useState("");
  const spec = getTemplate(r.settings.template);
  const templateShowsMeters = spec.tokens.meter !== "none";
  const rated = r.skills.filter((s) => s.level !== null).length;

  function applyBulk() {
    const lines = draft
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    patch((d) => {
      // Keep the rating of any skill whose name is already in the list.
      const existing = new Map(d.skills.map((s) => [s.name.toLowerCase(), s.level]));
      d.skills = lines.map((name) => ({
        id: uid(),
        name,
        level: existing.get(name.toLowerCase()) ?? null,
      }));
    });
    setBulk(false);
    setDraft("");
  }

  if (bulk) {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 flex items-baseline justify-between text-xs font-medium text-slate-600">
            <span>Paste a list</span>
            <span className="font-normal text-slate-400">one skill per line</span>
          </span>
          <textarea
            autoFocus
            rows={10}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={"Google Ads\nSEO — Technical & On-Page\nGoogle Analytics 4"}
            className="w-full resize-y rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm leading-relaxed text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <p className="text-xs leading-relaxed text-slate-500">
          This replaces the whole list. Ratings are kept for any skill whose name still matches.
        </p>
        <div className="flex gap-2">
          <Button variant="primary" onClick={applyBulk}>
            Replace list
          </Button>
          <Button onClick={() => setBulk(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        {templateShowsMeters ? (
          <>
            <span className="font-semibold text-slate-800">{spec.name}</span> draws{" "}
            {spec.tokens.meter === "bar" ? "bars" : spec.tokens.meter === "dots" ? "dots" : "stars"} for
            rated skills. {rated === 0 && "Nothing is rated yet, so none will show."}
          </>
        ) : (
          <>
            <span className="font-semibold text-slate-800">{spec.name}</span> does not display ratings —
            it prints skill names only. Ratings are kept, and appear if you switch to a template that
            uses them.
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          variant="primary"
          onClick={() => {
            const id = uid();
            patch((d) => d.skills.unshift({ id, name: "", level: null } as Skill));
            reveal(id);
          }}
        >
          + Add skill
        </Button>
        <Button
          onClick={() => {
            setDraft(r.skills.map((s) => s.name).join("\n"));
            setBulk(true);
          }}
        >
          Paste a list
        </Button>
        {rated > 0 && (
          <Button onClick={() => patch((d) => d.skills.forEach((s) => void (s.level = null)))}>
            Clear all ratings
          </Button>
        )}
      </div>

      {r.skills.map((s, i) => (
        <div
          key={s.id}
          id={`item-${s.id}`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2"
        >
          <input
            value={s.name}
            placeholder="Skill name"
            onChange={(e) => patch((d) => void (d.skills[i].name = e.target.value))}
            className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <Rating
            value={s.level}
            onChange={(v) => patch((d) => void (d.skills[i].level = v))}
          />
          <ItemControls
            isFirst={i === 0}
            isLast={i === r.skills.length - 1}
            onUp={() => patch((d) => move(d.skills, i, i - 1))}
            onDown={() => patch((d) => move(d.skills, i, i + 1))}
            onRemove={() => patch((d) => void d.skills.splice(i, 1))}
          />
        </div>
      ))}

    </div>
  );
}
