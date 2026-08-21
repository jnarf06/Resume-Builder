/**
 * Colour maths for the picker: conversion between hex/RGB/HSL, harmony
 * generation, and WCAG contrast. No dependencies — this is all closed-form.
 */

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  const l = (max + min) / 2;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === R) h = ((G - B) / d) % 6;
  else if (max === G) h = (B - R) / d + 2;
  else h = (R - G) / d + 4;
  h *= 60;
  if (h < 0) h += 360;

  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const S = clamp(s / 100);
  const L = clamp(l / 100);
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r1, g1, b1] =
    hp < 1
      ? [c, x, 0]
      : hp < 2
        ? [x, c, 0]
        : hp < 3
          ? [0, c, x]
          : hp < 4
            ? [0, x, c]
            : hp < 5
              ? [x, 0, c]
              : [c, 0, x];
  const m = L - c / 2;
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

export const hexToHsl = (hex: string): Hsl => rgbToHsl(hexToRgb(hex));
export const hslToHex = (hsl: Hsl): string => rgbToHex(hslToRgb(hsl));

/* ------------------------------------------------------------------ harmony */

export type HarmonyId = "complementary" | "analogous" | "triadic" | "tetradic" | "monochrome";

export const HARMONIES: { id: HarmonyId; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochrome", label: "Monochrome" },
];

/** Colours related to `hex` by the chosen scheme, the base always first. */
export function harmony(hex: string, kind: HarmonyId): string[] {
  const base = hexToHsl(hex);
  const at = (dh: number, dl = 0, ds = 0) =>
    hslToHex({
      h: (base.h + dh + 360) % 360,
      s: clamp((base.s + ds) / 100) * 100,
      l: clamp((base.l + dl) / 100) * 100,
    });

  switch (kind) {
    case "complementary":
      return [hex, at(180)];
    case "analogous":
      return [at(-30), hex, at(30)];
    case "triadic":
      return [hex, at(120), at(240)];
    case "tetradic":
      return [hex, at(90), at(180), at(270)];
    case "monochrome":
      return [at(0, 32), at(0, 16), hex, at(0, -16), at(0, -32)];
  }
}

/* ----------------------------------------------------------------- contrast */

function channel(v: number) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.1 contrast ratio, 1 (identical) to 21 (black on white). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Plain-language verdict for body text at normal size. A resume is read on
 * screen and printed, so anything under AA is a genuine legibility problem.
 */
export function contrastVerdict(ratio: number): { label: string; tone: "good" | "ok" | "bad" } {
  if (ratio >= 7) return { label: "Excellent", tone: "good" };
  if (ratio >= 4.5) return { label: "Good", tone: "good" };
  if (ratio >= 3) return { label: "Headings only", tone: "ok" };
  return { label: "Too low", tone: "bad" };
}
