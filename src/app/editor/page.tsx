"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Resume } from "@/lib/types";

import {
  duplicateResume,
  exportJson,
  importJson,
  newResume,
  setActiveId,
  withSampleContent,
} from "@/lib/storage";
import { useLibrary } from "@/lib/useLibrary";
import { buildShareLink, copyToClipboard, decodeResume, takeSharePayload } from "@/lib/share";
import { StorageBanner } from "@/components/Banners";
import { auditResume } from "@/lib/audit";
import EditorPanel from "@/components/editor/EditorPanel";
import AuditPanel from "@/components/AuditPanel";
import Renderer from "@/components/templates/Renderer";
import TemplateGallery from "@/components/TemplateGallery";

type Tab = "edit" | "check";

export default function EditorRoute() {
  // useSearchParams needs a Suspense boundary for the statically exported page.
  return (
    <Suspense fallback={<Splash />}>
      <Editor />
    </Suspense>
  );
}

function Splash() {
  return <div className="grid min-h-screen place-items-center text-sm text-slate-400">Loading…</div>;
}

function Editor() {
  const params = useSearchParams();
  const wanted = params.get("id");
  const { list, setList, ready, savedAt } = useLibrary();
  const [activeId, setActive] = useState<string>("");
  const [tab, setTab] = useState<Tab>("edit");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [shareNote, setShareNote] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  // Open whichever resume the dashboard linked to; fall back to the first one.
  const resolvedId = useMemo(() => {
    if (activeId && list.some((r) => r.id === activeId)) return activeId;
    if (wanted && list.some((r) => r.id === wanted)) return wanted;
    return list[0]?.id ?? "";
  }, [activeId, wanted, list]);

  const resume = useMemo(() => list.find((r) => r.id === resolvedId), [list, resolvedId]);

  /** Mutate a structural copy of the active resume; everything else stays put. */
  const patch = useCallback(
    (fn: (draft: Resume) => void) => {
      setList((prev) =>
        prev.map((r) => {
          if (r.id !== resolvedId) return r;
          const draft: Resume = JSON.parse(JSON.stringify(r));
          fn(draft);
          draft.updatedAt = Date.now();
          return draft;
        }),
      );
    },
    [resolvedId, setList],
  );

  useEffect(() => {
    if (ready && resolvedId) setActiveId(resolvedId);
  }, [resolvedId, ready]);

  // A resume arriving by shared link. The payload lives in the URL fragment,
  // which never reaches a server, and is consumed on read so a refresh does
  // not import it twice.
  useEffect(() => {
    if (!ready) return;
    const payload = takeSharePayload();
    if (!payload) return;
    let cancelled = false;
    decodeResume(payload)
      .then((incoming) => {
        if (cancelled) return;
        setList((p) => [...p, incoming]);
        setActive(incoming.id);
        setShareNote(`Opened “${incoming.docName}” from a shared link. It is now saved here.`);
      })
      .catch(() => {
        if (!cancelled) setShareNote("That shared link could not be read.");
      });
    return () => {
      cancelled = true;
    };
  }, [ready, setList]);

  async function share() {
    if (!resume) return;
    const link = await buildShareLink(resume);
    const ok = await copyToClipboard(link);
    setShareNote(
      ok
        ? "Link copied. It carries the resume itself — no photo, and nothing is uploaded."
        : "Could not reach the clipboard. Copy the address bar after opening the link.",
    );
  }

  const issueCount = resume ? auditResume(resume).length : 0;

  function addResume(from: "sample" | "blank") {
    const r = newResume(from);
    setList((p) => [...p, r]);
    setActive(r.id);
  }

  function duplicate() {
    if (!resume) return;
    const copy = duplicateResume(resume);
    setList((p) => [...p, copy]);
    setActive(copy.id);
  }

  function remove() {
    if (!resume) return;
    if (!confirm(`Delete "${resume.docName}"? This cannot be undone.`)) return;
    const rest = list.filter((r) => r.id !== resume.id);
    const next = rest.length ? rest : [newResume("blank")];
    setList(next);
    setActive(next[0].id);
  }

  function fillWithSample() {
    if (!resume) return;
    if (
      !confirm(
        [
          "Replace this resume's content with sample data?",
          "",
          "Your template, colours and format settings are kept. Your current text is overwritten and cannot be recovered — Export it first if you want a copy.",
        ].join("\n"),
      )
    )
      return;
    setList((p) => p.map((x) => (x.id === resolvedId ? withSampleContent(x) : x)));
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      const r = await importJson(file);
      setList((p) => [...p, r]);
      setActive(r.id);
    } catch {
      alert("That file is not a resume export.");
    }
  }

  if (!ready) return <Splash />;

  // The library can legitimately be empty — a first-time visitor arriving
  // straight from the homepage CTA, or someone who has just cleared their data.
  // Offer a way forward rather than sitting on a spinner.
  if (!resume) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 px-6">
        <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-base font-bold text-slate-900">Nothing open yet</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Start a blank resume, or load a filled example to see what a strong one looks like before
            writing your own.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                const fresh = newResume("blank");
                setList((p) => [...p, fresh]);
                setActive(fresh.id);
              }}
              className="rounded-md bg-slate-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              New blank resume
            </button>
            <button
              type="button"
              onClick={() => {
                const fresh = newResume("sample");
                setList((p) => [...p, fresh]);
                setActive(fresh.id);
              }}
              className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Load example
            </button>
          </div>
          <Link href="/dashboard" className="mt-4 inline-block text-xs text-slate-500 hover:text-slate-800">
            ‹ Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <div className="no-print">
        <StorageBanner />
        {shareNote && (
          <div className="flex items-center gap-3 border-b border-sky-200 bg-sky-50 px-4 py-2 text-xs text-sky-900">
            <span className="leading-relaxed">{shareNote}</span>
            <button
              type="button"
              onClick={() => setShareNote("")}
              className="ml-auto shrink-0 rounded border border-sky-300 px-2 py-0.5 font-medium hover:bg-sky-100"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
      {/* ---------------------------------------------------------- toolbar */}
      <header className="no-print flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <Link
          href="/"
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          ‹ Dashboard
        </Link>

        <select
          value={resolvedId}
          onChange={(e) => setActive(e.target.value)}
          className="max-w-[240px] rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
        >
          {list.map((r) => (
            <option key={r.id} value={r.id}>
              {r.docName}
            </option>
          ))}
        </select>

        <input
          value={resume.docName}
          onChange={(e) => patch((d) => void (d.docName = e.target.value))}
          className="w-48 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
          aria-label="Resume name"
        />

        <div className="flex flex-wrap gap-1.5 text-xs">
          <Tool onClick={() => setGalleryOpen(true)}>Templates</Tool>
          <Tool onClick={() => addResume("blank")}>New</Tool>
          <Tool onClick={() => addResume("sample")}>New from sample</Tool>
          <Tool onClick={duplicate}>Duplicate</Tool>
          <Tool onClick={fillWithSample}>Sample data</Tool>
          <Tool onClick={() => importRef.current?.click()}>Import</Tool>
          <Tool onClick={() => exportJson(resume)}>Export data</Tool>
          <Tool onClick={share}>Share link</Tool>
          <Tool onClick={remove} danger>
            Delete
          </Tool>
        </div>

        <input
          ref={importRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => onImport(e.target.files?.[0])}
        />

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            {savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString()}` : "Saving…"}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Download PDF
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ------------------------------------------------------- left pane */}
        <div className="no-print flex w-[420px] shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="flex shrink-0 border-b border-slate-200">
            <TabButton active={tab === "edit"} onClick={() => setTab("edit")}>
              Edit
            </TabButton>
            <TabButton active={tab === "check"} onClick={() => setTab("check")}>
              Check
              {issueCount > 0 && (
                <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 text-[10px] font-bold text-slate-600">
                  {issueCount}
                </span>
              )}
            </TabButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "edit" ? (
              <EditorPanel r={resume} patch={patch} onBrowseTemplates={() => setGalleryOpen(true)} />
            ) : (
              <AuditPanel r={resume} />
            )}
          </div>
        </div>

        {/* --------------------------------------------------------- preview */}
        <div className="min-h-0 flex-1 overflow-auto bg-slate-200 p-8 print:overflow-visible print:bg-white print:p-0">
          <div
            className="print-root mx-auto bg-white shadow-xl print:shadow-none"
            style={{ width: "794px", fontSize: `${12 * resume.settings.fontScale}px` }}
          >
            <Renderer r={resume} />
          </div>
        </div>
      </div>

      {galleryOpen && (
        <TemplateGallery
          r={resume}
          onPick={(id) => patch((d) => void (d.settings.template = id))}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}

function Tool({
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
      className={`rounded-md border px-2 py-1 font-medium transition ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-b-2 border-slate-800 text-slate-900"
          : "border-b-2 border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}
