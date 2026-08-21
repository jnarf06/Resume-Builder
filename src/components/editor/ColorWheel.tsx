"use client";

import { useRef, useState } from "react";
import {
  HARMONIES,
  contrastRatio,
  contrastVerdict,
  harmony,
  hexToHsl,
  hexToRgb,
  hslToHex,
  type HarmonyId,
} from "@/lib/color";

const SIZE = 168;

/**
 * HSL wheel: angle is hue, distance from centre is saturation, and the slider
 * underneath is lightness. The disc is drawn with two CSS gradients rather than
 * a canvas — it stays crisp at any zoom and costs nothing to render.
 */
export default function ColorWheel({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const discRef = useRef<HTMLDivElement>(null);
  const [scheme, setScheme] = useState<HarmonyId>("complementary");

  const hsl = hexToHsl(value);
  const rgb = hexToRgb(value);

  // Marker position: 0° at the top, running clockwise.
  const rad = (hsl.h * Math.PI) / 180;
  const dist = (hsl.s / 100) * (SIZE / 2);
  const mx = SIZE / 2 + Math.sin(rad) * dist;
  const my = SIZE / 2 - Math.cos(rad) * dist;

  function pick(clientX: number, clientY: number) {
    const el = discRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const radius = box.width / 2;
    const dx = clientX - (box.left + radius);
    const dy = clientY - (box.top + radius);

    const saturation = Math.min(1, Math.hypot(dx, dy) / radius) * 100;
    let hue = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (hue < 0) hue += 360;

    onChange(hslToHex({ h: hue, s: saturation, l: hsl.l }));
  }

  const onWhite = contrastRatio(value, "#ffffff");
  const verdict = contrastVerdict(onWhite);
  const swatches = harmony(value, scheme);

  return (
    <div>
      <div className="flex gap-3">
        {/* wheel */}
        <div className="shrink-0">
          <div
            ref={discRef}
            role="application"
            aria-label="Colour wheel"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              pick(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) pick(e.clientX, e.clientY);
            }}
            className="relative cursor-crosshair rounded-full"
            style={{
              width: SIZE,
              height: SIZE,
              background: `
                radial-gradient(circle closest-side, #fff, transparent 100%),
                conic-gradient(
                  hsl(0 100% 50%), hsl(30 100% 50%), hsl(60 100% 50%), hsl(90 100% 50%),
                  hsl(120 100% 50%), hsl(150 100% 50%), hsl(180 100% 50%), hsl(210 100% 50%),
                  hsl(240 100% 50%), hsl(270 100% 50%), hsl(300 100% 50%), hsl(330 100% 50%),
                  hsl(360 100% 50%)
                )`,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)",
            }}
          >
            {/* lightness is not on the disc, so dim or lift it to preview */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                backgroundColor: hsl.l < 50 ? "#000" : "#fff",
                opacity: Math.abs(hsl.l - 50) / 50 * 0.8,
              }}
            />
            <span
              className="pointer-events-none absolute block rounded-full border-2 border-white"
              style={{
                left: mx - 7,
                top: my - 7,
                width: 14,
                height: 14,
                backgroundColor: value,
                boxShadow: "0 0 0 1px rgba(0,0,0,.45)",
              }}
            />
          </div>

          {/* lightness */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(hsl.l)}
            onChange={(e) => onChange(hslToHex({ ...hsl, l: Number(e.target.value) }))}
            aria-label="Lightness"
            className="mt-2 w-full accent-slate-700"
            style={{
              background: `linear-gradient(to right, #000, ${hslToHex({ ...hsl, l: 50 })}, #fff)`,
              height: 8,
              borderRadius: 999,
              appearance: "none",
            }}
          />
        </div>

        {/* readouts */}
        <div className="min-w-0 flex-1 space-y-1.5 text-[10px] text-slate-500">
          <div
            className="h-9 w-full rounded border border-slate-300"
            style={{ backgroundColor: value }}
          />
          <Readout label="HEX" value={value.toUpperCase()} />
          <Readout label="RGB" value={`${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}`} />
          <Readout
            label="HSL"
            value={`${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`}
          />
          <div>
            <p className="font-semibold uppercase tracking-wide text-slate-400">On white</p>
            <p
              className={
                verdict.tone === "good"
                  ? "text-emerald-700"
                  : verdict.tone === "ok"
                    ? "text-amber-700"
                    : "text-red-600"
              }
            >
              {onWhite.toFixed(1)}:1 · {verdict.label}
            </p>
          </div>
        </div>
      </div>

      {/* harmony */}
      <div className="mt-3 border-t border-slate-200 pt-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-600">Palette</span>
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value as HarmonyId)}
            className="rounded border border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-700"
          >
            {HARMONIES.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400">click to use</span>
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {swatches.map((c, i) => (
            <button
              key={`${c}-${i}`}
              type="button"
              onClick={() => onChange(c)}
              title={c.toUpperCase()}
              className="h-9 flex-1 rounded border border-slate-300 transition hover:scale-105"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-mono text-[11px] text-slate-700">{value}</p>
    </div>
  );
}
