"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resume } from "@/lib/types";
import {
  clearAll,
  duplicateResume,
  exportJson,
  importJson,
  newResume,
  setActiveId,
  withSampleContent,
} from "@/lib/storage";
import { useLibrary, timeAgo } from "@/lib/useLibrary";
import { auditResume, scoreOf } from "@/lib/audit";
import { ALL_TEMPLATES, getTemplate } from "@/lib/templates/catalog";
import { INDUSTRIES } from "@/lib/templates/types";
import { MOCK } from "@/lib/seed";
import PagePreview from "@/components/templates/PagePreview";

/** A few templates surfaced on the dashboard as a way in to the catalogue. */
const FEATURED = ["ortigas", "manila-plain", "lagoon", "broadsheet", "makati", "onyx"];

export default function Dashboard() {
  const router = useRouter();
  const { list, setList, ready } = useLibrary();
  const importRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    if (!list.length) return { count: 0, best: 0, atsReady: 0, issues: 0 };
    const scores = list.map((r) => scoreOf(auditResume(r)));
    return {
      count: list.length,
      best: Math.max(...scores),
      atsReady: list.filter((r) => getTemplate(r.settings.template).atsSafe).length,
      issues: list.reduce((n, r) => n + auditResume(r).filter((i) => i.level === "error").length, 0),
    };
  }, [list]);

  const sorted = useMemo(() => [...list].sort((a, b) => b.updatedAt - a.updatedAt), [list]);

  function open(id: string) {
    setActiveId(id);
    router.push(`/editor?id=${id}`);
  }

  function create(from: "sample" | "blank", templateId?: string) {
    if (busy) return;
    setBusy(true);
    const r = newResume(from);
    if (templateId) r.settings.template = templateId;
    setList((p) => [...p, r]);
    setActiveId(r.id);
    router.push(`/editor?id=${r.id}`);
  }

  function duplicate(r: Resume) {
    setList((p) => [...p, duplicateResume(r)]);
  }

  function remove(r: Resume) {
    if (!confirm(`Delete "${r.docName}"? This cannot be undone.`)) return;
    setList((p) => p.filter((x) => x.id !== r.id));
  }

  function anonymise(r: Resume) {
    const msg = [
      `Replace the content of "${r.docName}" with sample data?`,
      "",
      "The template and format settings are kept. The text is overwritten and cannot be recovered.",
    ].join("\n");
    if (!confirm(msg)) return;
    setList((p) => p.map((x) => (x.id === r.id ? withSampleContent(x) : x)));
  }

  function wipe() {
    const msg = [
      `Delete all ${list.length} resumes from this browser?`,
      "",
      "This cannot be undone. Export anything you want to keep first.",
    ].join("\n");
    if (!confirm(msg)) return;
    clearAll();
    setList([]);
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      const r = await importJson(file);
      setList((p) => [...p, r]);
    } catch {
      alert("That file is not a resume export.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ------------------------------------------------------------- nav */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded bg-slate-800 text-xs font-bold text-white">
              R
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900">Resume Builder</span>
          </Link>
          <span className="text-xs font-medium text-slate-400">Dashboard</span>
          <nav className="ml-auto flex items-center gap-2 text-xs">
            {ready && list.length > 0 && (
              <button
                type="button"
                onClick={wipe}
                className="rounded-md border border-red-200 px-2.5 py-1.5 font-medium text-red-600 hover:bg-red-50"
              >
                Clear all data
              </button>
            )}
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="rounded-md border border-slate-300 px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => create("blank")}
              className="rounded-md bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700"
            >
              New resume
            </button>
          </nav>
        </div>
      </header>

      <input
        ref={importRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => onImport(e.target.files?.[0])}
      />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* ------------------------------------------------------------ hero */}
        <section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your resumes</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Everything is saved in this browser. Open one to edit it, duplicate it to make an
                ATS-safe version, or start a new one from any of the {ALL_TEMPLATES.length} templates.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => create("blank")}
                  className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Start from scratch
                </button>
                <button
                  type="button"
                  onClick={() => create("sample")}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Start from a filled example
                </button>
              </div>
            </div>
            <div className="hidden shrink-0 gap-3 sm:flex">
              <div className="rotate-[-4deg] rounded shadow-lg ring-1 ring-slate-200">
                <PagePreview r={MOCK} templateId="ortigas" width={110} />
              </div>
              <div className="rotate-[3deg] rounded shadow-lg ring-1 ring-slate-200">
                <PagePreview r={MOCK} templateId="lagoon" width={110} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 sm:grid-cols-4">
            <Stat label="Resumes" value={ready ? String(stats.count) : "—"} />
            <Stat label="Best score" value={ready && stats.count ? `${stats.best}/100` : "—"} />
            <Stat
              label="ATS-safe"
              value={ready && stats.count ? `${stats.atsReady} of ${stats.count}` : "—"}
            />
            <Stat
              label="Must-fix issues"
              value={ready ? String(stats.issues) : "—"}
              tone={ready && stats.issues > 0 ? "warn" : "ok"}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- resumes */}
        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Your resumes</h2>
            {ready && sorted.length > 0 && (
              <span className="text-xs text-slate-400">{sorted.length} saved in this browser</span>
            )}
          </div>

          {!ready ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
              Loading…
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-medium text-slate-700">No resumes yet.</p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                Start blank, or load the filled example to see what a strong resume looks like before
                writing your own.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => create("blank")}
                  className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  New resume
                </button>
                <button
                  type="button"
                  onClick={() => create("sample")}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Load example
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
              {sorted.map((r) => (
                <ResumeCard
                  key={r.id}
                  r={r}
                  onOpen={() => open(r.id)}
                  onDuplicate={() => duplicate(r)}
                  onAnonymise={() => anonymise(r)}
                  onExport={() => exportJson(r)}
                  onDelete={() => remove(r)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ------------------------------------------------------- templates */}
        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Start from a template
            </h2>
            <span className="text-xs text-slate-400">
              {ALL_TEMPLATES.length} available · browse them all inside the editor
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {FEATURED.map((id) => {
              const spec = getTemplate(id);
              return (
                <button key={id} type="button" onClick={() => create("blank", id)} className="group text-left">
                  <div className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition group-hover:border-slate-400 group-hover:shadow-md">
                    <PagePreview r={MOCK} templateId={id} width={150} />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-800">
                    {spec.name}
                    {spec.atsSafe && (
                      <span className="ml-1.5 rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                        ATS
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] leading-snug text-slate-500">{spec.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------------- notes */}
        <section className="grid gap-4 sm:grid-cols-3">
          <InfoCard title="Two versions, always">
            Keep an ATS-safe single-column resume for job portals and a designed one for when a person
            opens the file. Duplicate a resume, switch its template, done.
          </InfoCard>
          <InfoCard title="Numbers beat duties">
            “Managed a team” is forgettable. “Led 20 across three regions, cut CPA 34%” is not. The
            Check tab flags a resume where too few bullets carry a figure.
          </InfoCard>
          <InfoCard title="Everything stays local">
            Resumes live in this browser only — no account, no server. Use Export on a card to keep a
            JSON backup, and Import to move it to another machine.
          </InfoCard>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-400">
          Built for Philippine-format resumes — photo, references and declaration supported, and
          switchable off for international applications. Industry tags include{" "}
          {INDUSTRIES.slice(0, 6)
            .map((i) => i.label)
            .join(", ")}
          , and {INDUSTRIES.length - 6} more.
        </footer>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Stat({ label, value, tone = "ok" }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="px-5 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-0.5 text-lg font-bold tabular-nums ${
          tone === "warn" ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{children}</p>
    </div>
  );
}

function ResumeCard({
  r,
  onOpen,
  onDuplicate,
  onAnonymise,
  onExport,
  onDelete,
}: {
  r: Resume;
  onOpen: () => void;
  onDuplicate: () => void;
  onAnonymise: () => void;
  onExport: () => void;
  onDelete: () => void;
}) {
  const spec = getTemplate(r.settings.template);
  const issues = auditResume(r);
  const score = scoreOf(issues);
  const errors = issues.filter((i) => i.level === "error").length;
  const chip =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 55
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-700";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <button type="button" onClick={onOpen} className="group relative block w-full">
        <PagePreview r={r} templateId={r.settings.template} width={220} />
        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
          <span className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow">
            Open editor
          </span>
        </span>
        <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${chip}`}>
          {score}
        </span>
      </button>

      <div className="border-t border-slate-200 p-3">
        <p className="truncate text-sm font-semibold text-slate-800">{r.docName}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {spec.name}
          {spec.atsSafe ? " · ATS-safe" : " · two column"} · edited {timeAgo(r.updatedAt)}
        </p>
        {errors > 0 && (
          <p className="mt-1 text-[11px] font-medium text-red-600">
            {errors} must-fix {errors === 1 ? "issue" : "issues"}
          </p>
        )}
        <div className="mt-2 flex gap-1">
          <CardAction onClick={onDuplicate}>Duplicate</CardAction>
          <CardAction onClick={onExport}>Export</CardAction>
          <CardAction onClick={onAnonymise}>Sample data</CardAction>
          <CardAction onClick={onDelete} danger>
            Delete
          </CardAction>
        </div>
      </div>
    </div>
  );
}

function CardAction({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border px-1.5 py-1 text-[10px] font-medium transition ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
