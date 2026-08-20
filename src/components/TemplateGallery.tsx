"use client";

import { useMemo, useState } from "react";
import type { Resume } from "@/lib/types";
import { MOCK } from "@/lib/seed";
import { ALL_TEMPLATES, getTemplate, templatesFor } from "@/lib/templates/catalog";
import { INDUSTRIES, type IndustryId } from "@/lib/templates/types";
import PagePreview from "./templates/PagePreview";

const THUMB_W = 200;
const BIG_W = 540;

/** Trim a resume down to what reads legibly at preview scale. */
function trim(r: Resume): Resume {
  return {
    ...r,
    skills: r.skills.slice(0, 10),
    experience: r.experience.slice(0, 3).map((e) => ({ ...e, bullets: e.bullets.slice(0, 3) })),
    education: r.education.slice(0, 2),
    references: r.references.slice(0, 1),
  };
}

export default function TemplateGallery({
  r,
  onPick,
  onClose,
}: {
  r: Resume;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [industry, setIndustry] = useState<IndustryId | "all">("all");
  const [atsOnly, setAtsOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [useMine, setUseMine] = useState(false);
  const [zoomed, setZoomed] = useState<string | null>(null);

  /**
   * Preview with mock content by default. A brand-new resume is empty, and an
   * empty resume renders every template as the same blank sheet.
   */
  const preview = useMemo(() => (useMine ? trim(r) : MOCK), [useMine, r]);

  const shown = useMemo(() => {
    let list = templatesFor(industry);
    if (atsOnly) list = list.filter((t) => t.atsSafe);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((t) => (t.name + " " + t.blurb).toLowerCase().includes(q));
    return list;
  }, [industry, atsOnly, query]);

  const zoomSpec = zoomed ? getTemplate(zoomed) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 p-6" onClick={onClose}>
      <div
        className="mx-auto flex h-full w-full max-w-[1400px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* toolbar */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-bold text-slate-900">Templates</h2>
          <span className="text-xs text-slate-400">
            {shown.length} of {ALL_TEMPLATES.length}
          </span>

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value as IndustryId | "all")}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
          >
            <option value="all">All industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            className="w-44 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
          />

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={atsOnly}
              onChange={(e) => setAtsOnly(e.target.checked)}
              className="h-3.5 w-3.5 accent-slate-700"
            />
            ATS-safe only
          </label>

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={useMine}
              onChange={(e) => setUseMine(e.target.checked)}
              className="h-3.5 w-3.5 accent-slate-700"
            />
            Preview with my content
          </label>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {/* grid */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-6">
          {shown.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              Nothing matches. Clear the ATS filter or pick another industry.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
              {shown.map((spec) => {
                const active = spec.id === r.settings.template;
                return (
                  <div key={spec.id} className="w-[200px]">
                    <div
                      className={`group relative rounded-lg border-2 bg-white shadow-sm transition hover:shadow-lg ${
                        active ? "border-slate-800 ring-2 ring-slate-300" : "border-slate-200"
                      }`}
                    >
                      <PagePreview r={preview} templateId={spec.id} width={THUMB_W} />

                      {spec.atsSafe && (
                        <span className="pointer-events-none absolute right-1.5 top-1.5 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          ATS
                        </span>
                      )}

                      {/* hover actions */}
                      <div className="absolute inset-0 flex items-end justify-center gap-2 bg-slate-900/0 p-3 opacity-0 transition group-hover:bg-slate-900/45 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            onPick(spec.id);
                            onClose();
                          }}
                          className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow hover:bg-slate-100"
                        >
                          Use this
                        </button>
                        <button
                          type="button"
                          onClick={() => setZoomed(spec.id)}
                          className="rounded-md bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-slate-900"
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-800">
                      {spec.name}
                      {active && <span className="ml-1.5 text-[10px] font-normal text-slate-400">in use</span>}
                    </p>
                    <p className="text-[11px] leading-snug text-slate-500">{spec.blurb}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-slate-200 px-5 py-2 text-[11px] text-slate-500">
          <span className="font-semibold text-emerald-700">ATS</span> marks single-column layouts whose
          text reads top-to-bottom. Two-column designs look better to a person and parse worse in a job
          portal — keep one of each.
        </p>
      </div>

      {/* full-size preview */}
      {zoomSpec && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-6"
          onClick={() => setZoomed(null)}
        >
          <div
            className="flex max-h-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{zoomSpec.name}</p>
                <p className="truncate text-xs text-slate-500">{zoomSpec.blurb}</p>
              </div>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  zoomSpec.atsSafe ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                }`}
              >
                {zoomSpec.atsSafe ? "ATS-safe" : "Two column"}
              </span>
              <div className="ml-auto flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPick(zoomSpec.id);
                    setZoomed(null);
                    onClose();
                  }}
                  className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Use this template
                </button>
                <button
                  type="button"
                  onClick={() => setZoomed(null)}
                  className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="min-h-0 overflow-y-auto bg-slate-100 p-5">
              <div className="mx-auto shadow-lg">
                <PagePreview r={preview} templateId={zoomSpec.id} width={BIG_W} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
