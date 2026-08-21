"use client";

import { useState } from "react";
import ColorWheel from "./ColorWheel";

/**
 * One colour control, shared by the document palette and the per-section
 * headings. Three ways in, because people arrive with different things in hand:
 * a full swatch grid to browse, a hex box for a brand colour someone gave you,
 * and the OS colour picker for everything else.
 */

/** 15 hues × 5 steps, plus neutrals. Enough to pick from without a colour theory lesson. */
const HUES: { name: string; shades: string[] }[] = [
  { name: "Slate", shades: ["#f1f5f9", "#cbd5e1", "#64748b", "#334155", "#0f172a"] },
  { name: "Red", shades: ["#fee2e2", "#fca5a5", "#ef4444", "#b91c1c", "#7f1d1d"] },
  { name: "Orange", shades: ["#ffedd5", "#fdba74", "#f97316", "#c2410c", "#7c2d12"] },
  { name: "Amber", shades: ["#fef3c7", "#fcd34d", "#f59e0b", "#b45309", "#78350f"] },
  { name: "Yellow", shades: ["#fef9c3", "#fde047", "#eab308", "#a16207", "#713f12"] },
  { name: "Lime", shades: ["#ecfccb", "#bef264", "#84cc16", "#4d7c0f", "#365314"] },
  { name: "Green", shades: ["#dcfce7", "#86efac", "#22c55e", "#15803d", "#14532d"] },
  { name: "Emerald", shades: ["#d1fae5", "#6ee7b7", "#10b981", "#047857", "#064e3b"] },
  { name: "Teal", shades: ["#ccfbf1", "#5eead4", "#14b8a6", "#0f766e", "#134e4a"] },
  { name: "Cyan", shades: ["#cffafe", "#67e8f9", "#06b6d4", "#0e7490", "#164e63"] },
  { name: "Sky", shades: ["#e0f2fe", "#7dd3fc", "#0ea5e9", "#0369a1", "#0c4a6e"] },
  { name: "Blue", shades: ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"] },
  { name: "Indigo", shades: ["#e0e7ff", "#a5b4fc", "#6366f1", "#4338ca", "#312e81"] },
  { name: "Violet", shades: ["#ede9fe", "#c4b5fd", "#8b5cf6", "#6d28d9", "#4c1d95"] },
  { name: "Rose", shades: ["#ffe4e6", "#fda4af", "#f43f5e", "#be123c", "#881337"] },
];

const NEUTRALS = ["#ffffff", "#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#1e293b", "#000000"];

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** "#abc" -> "#aabbcc"; anything invalid returns null. */
export function normalizeHex(input: string): string | null {
  const m = input.trim().match(HEX);
  if (!m) return null;
  const body = m[1];
  const full = body.length === 3 ? body.split("").map((c) => c + c).join("") : body;
  return `#${full.toLowerCase()}`;
}

export default function ColorField({
  label,
  hint,
  value,
  isCustom,
  onChange,
  onReset,
  compact = false,
}: {
  label: string;
  hint?: string;
  /** The colour currently in effect, whether inherited or overridden. */
  value: string;
  isCustom: boolean;
  onChange: (hex: string) => void;
  onReset: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [bad, setBad] = useState(false);
  const [tab, setTab] = useState<"swatches" | "wheel">("swatches");

  const shown = (draft || value).toString();

  function commitHex(raw: string) {
    const hex = normalizeHex(raw);
    if (!hex) {
      setBad(true);
      return;
    }
    setBad(false);
    onChange(hex);
  }

  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setDraft(value);
            setBad(false);
          }}
          className="h-7 w-7 shrink-0 rounded border border-slate-300 transition hover:ring-2 hover:ring-slate-300"
          style={{ backgroundColor: value }}
          aria-label={`Change ${label}`}
        />

        <div className="min-w-0 flex-1">
          <p className={`font-semibold text-slate-800 ${compact ? "text-[11px]" : "text-xs"}`}>
            {label}
            {!isCustom && <span className="ml-1.5 font-normal text-slate-400">template</span>}
          </p>
          {hint && <p className="truncate text-[10px] text-slate-500">{hint}</p>}
        </div>

        <code className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {value.toLowerCase()}
        </code>

        {isCustom && (
          <button
            type="button"
            onClick={onReset}
            title="Back to the template's colour"
            className="shrink-0 rounded border border-slate-300 px-1.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      {open && (
        <>
          {/* click-away layer */}
          <button
            type="button"
            aria-label="Close colour picker"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-50 mt-2.5 rounded-lg border border-slate-300 bg-white p-2.5 shadow-lg">
            <div className="mb-2.5 flex gap-1">
              {(["swatches", "wheel"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`rounded px-2 py-1 text-[11px] font-medium capitalize transition ${
                    tab === id
                      ? "bg-slate-800 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {id === "wheel" ? "Colour wheel" : "Swatches"}
                </button>
              ))}
            </div>

            {/* hex + system picker */}
            <div className="mb-2.5 flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500">Hex</span>
              <input
                value={shown}
                onChange={(e) => {
                  setDraft(e.target.value);
                  const hex = normalizeHex(e.target.value);
                  setBad(!hex && e.target.value.trim().length > 0);
                  if (hex) onChange(hex);
                }}
                onBlur={() => {
                  if (draft) commitHex(draft);
                  setDraft("");
                }}
                placeholder="#1f3a5f"
                spellCheck={false}
                className={`w-24 rounded-md border px-2 py-1 font-mono text-xs outline-none ${
                  bad
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-slate-300 text-slate-800 focus:border-slate-500"
                }`}
              />
              <label className="relative h-7 w-9 shrink-0 cursor-pointer overflow-hidden rounded border border-slate-300">
                <span className="block h-full w-full" style={{ backgroundColor: value }} />
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="System colour picker"
                />
              </label>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded border border-slate-300 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
              >
                Done
              </button>
            </div>

            {bad && (
              <p className="mb-2 text-[10px] text-red-600">
                Not a hex colour. Try three or six digits, like #1f3a5f.
              </p>
            )}

            {tab === "wheel" && <ColorWheel value={value} onChange={onChange} />}

            {/* neutrals */}
            {tab === "swatches" && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {NEUTRALS.map((c) => (
                <Swatch key={c} color={c} active={value.toLowerCase() === c} onPick={onChange} />
              ))}
            </div>
            )}

            {/* hue grid */}
            {tab === "swatches" && (
            <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
              {HUES.map((h) =>
                h.shades.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    title={`${h.name} ${c}`}
                    active={value.toLowerCase() === c}
                    onPick={onChange}
                  />
                )),
              )}
            </div>
            )}

            {tab === "swatches" && (
              <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                Dark colours read best for headings on white. Light ones suit panels and page
                backgrounds.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Swatch({
  color,
  active,
  title,
  onPick,
}: {
  color: string;
  active: boolean;
  title?: string;
  onPick: (hex: string) => void;
}) {
  return (
    <button
      type="button"
      title={title ?? color}
      aria-label={title ?? color}
      onClick={() => onPick(color)}
      className={`aspect-square w-full rounded border transition hover:scale-125 ${
        active ? "border-slate-900 ring-2 ring-slate-400" : "border-slate-200"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
