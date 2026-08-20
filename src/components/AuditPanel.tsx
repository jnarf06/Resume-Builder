"use client";

import { auditResume, scoreOf } from "@/lib/audit";
import type { Resume } from "@/lib/types";

const STYLES = {
  error: { chip: "bg-red-100 text-red-700", label: "Fix" },
  warn: { chip: "bg-amber-100 text-amber-800", label: "Check" },
  tip: { chip: "bg-sky-100 text-sky-800", label: "Tip" },
} as const;

export default function AuditPanel({ r }: { r: Resume }) {
  const issues = auditResume(r);
  const score = scoreOf(issues);
  const bar = score >= 80 ? "bg-emerald-500" : score >= 55 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="p-4">
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-800">Resume check</span>
          <span className="text-2xl font-bold tabular-nums text-slate-900">{score}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full ${bar} transition-all`} style={{ width: `${score}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {issues.length === 0
            ? "Nothing flagged. Export it."
            : `${issues.length} item${issues.length === 1 ? "" : "s"} to look at.`}
        </p>
      </div>

      <ul className="space-y-2.5">
        {issues.map((i) => (
          <li key={i.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${STYLES[i.level].chip}`}>
                {STYLES[i.level].label}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{i.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{i.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
