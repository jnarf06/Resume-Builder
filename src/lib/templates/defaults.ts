import type { EngineId, IndustryId, TemplateSpec, Tokens } from "./types";

/**
 * Token defaults and the `spec` builder live here rather than in catalog.ts so
 * that both catalogues can import them without the two files importing each
 * other — a cycle that leaves `spec` undefined at module-evaluation time.
 */

export const BASE: Tokens = {
  accent: "#3d4a5c",
  ink: "#1f2937",
  muted: "#64748b",
  surface: "#eef1f4",
  onAccent: "#ffffff",
  line: "#d7dbe1",
  font: "sans",
  headingFont: "sans",
  headingStyle: "underline",
  headingUpper: true,
  headingTracking: 0.14,
  nameUpper: true,
  nameSize: 2.6,
  nameWeight: 800,
  density: "normal",
  bullet: "dot",
  photo: "circle",
  photoFrame: "plain",
  sidebarWidth: 34,
  skillsInline: false,
  pageBg: "#ffffff",
  dark: false,
  meter: "none",
  decor: "none",
  nameTwoTone: false,
};

/** Dark-page defaults. Spread before any per-template overrides. */
export const DARK = {
  pageBg: "#1e2733",
  dark: true,
  ink: "#e8ecf1",
  muted: "#9fb0c3",
  surface: "#26313f",
  line: "#3a4657",
  onAccent: "#12181f",
} as const;

export type SpecInput = {
  id: string;
  name: string;
  blurb: string;
  engine: EngineId;
  side?: "left" | "right";
  industries: IndustryId[];
  atsSafe?: boolean;
  t?: Partial<Tokens>;
};

/**
 * Single-column shapes keep the text layer in reading order; anything with a
 * second column or heavy decoration does not, so it is not marked ATS-safe.
 */
export const SAFE_ENGINES: EngineId[] = [
  "stack",
  "centered",
  "banner",
  "timeline",
  "cards",
  "edge",
];

export function spec(s: SpecInput): TemplateSpec {
  return {
    id: s.id,
    name: s.name,
    blurb: s.blurb,
    engine: s.engine,
    side: s.side,
    industries: s.industries,
    atsSafe: s.atsSafe ?? SAFE_ENGINES.includes(s.engine),
    tokens: { ...BASE, ...s.t },
  };
}
