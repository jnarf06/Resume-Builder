/**
 * A template is a structural *engine* plus a set of *style tokens*.
 *
 * Eight engines cover the shapes a resume page can actually take; the tokens
 * carry everything else — palette, type, heading treatment, density, bullet
 * glyph, photo shape. That is what makes a catalogue of 50 maintainable: a new
 * template is a data entry in catalog.ts, not a new component.
 */

export type EngineId =
  | "sidebar" // tinted column beside the main content
  | "banner" // full-width accent header, one column below
  | "stack" // plain single column, no colour blocks — the ATS-safe shape
  | "centered" // centred name and rules, one column
  | "timeline" // vertical rail with markers down the experience list
  | "cards" // each section in its own bordered card
  | "edge" // thin accent strip down one edge
  | "compact" // main column plus short sections in a two-up grid
  | "wave" // curved divider between a colour field and the body
  | "modular" // content broken into a grid of filled blocks
  | "editorial" // magazine setting: big two-tone name, two-column body
  | "memphis" // geometric decoration — circles, dot grids, offset frames
  | "split"; // colour field with the photo straddling the boundary

export type FontId = "sans" | "serif" | "humanist" | "geometric" | "slab" | "condensed";

export const FONT_STACKS: Record<FontId, string> = {
  sans: '"Segoe UI", Roboto, Arial, Helvetica, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  humanist: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif',
  geometric: '"Century Gothic", "Avenir Next", "Segoe UI", sans-serif',
  slab: 'Rockwell, "Roboto Slab", Georgia, serif',
  condensed: '"Arial Narrow", "Segoe UI Semibold", Arial, sans-serif',
};

export type HeadingStyle =
  | "underline" // rule under the label
  | "bar" // short accent bar above the label
  | "plain" // label only
  | "boxed" // label on a filled accent block
  | "sidelined" // vertical accent rule to the left of the label
  | "ruled" // label with a rule running to the right margin
  | "chip" // label in a soft rounded pill
  | "highlight" // marker-pen swipe behind the label
  | "numbered" // circled number badge beside the label
  | "leader"; // label followed by a dotted leader line

/** How a skill or language level is drawn, when one is given. */
export type MeterStyle = "none" | "bar" | "dots" | "stars";

/** Decorative furniture drawn behind or around the page content. */
export type Decor = "none" | "corner" | "dot-grid" | "shapes";

/** How the portrait is framed. */
export type PhotoFrame = "plain" | "framed" | "arch";

export type Density = "tight" | "normal" | "airy";
export type BulletGlyph = "dot" | "dash" | "square" | "chevron" | "none";
export type PhotoShape = "circle" | "square" | "rounded" | "none";

export type Tokens = {
  accent: string;
  ink: string; // body text
  muted: string; // dates, secondary lines
  surface: string; // sidebar / card tint
  onAccent: string; // text sitting on the accent colour
  line: string; // rules and borders
  font: FontId;
  headingFont: FontId;
  headingStyle: HeadingStyle;
  headingUpper: boolean;
  headingTracking: number; // em
  nameUpper: boolean;
  nameSize: number; // em, relative to the 12px base
  nameWeight: 600 | 700 | 800;
  density: Density;
  bullet: BulletGlyph;
  photo: PhotoShape;
  photoFrame: PhotoFrame;
  sidebarWidth: number; // percent, sidebar/compact engines only
  skillsInline: boolean; // comma run instead of a list
  /** Page background. Set dark and the ink/muted tokens must be light to match. */
  pageBg: string;
  /** True when the page is dark — engines use it to flip rules and tints. */
  dark: boolean;
  meter: MeterStyle;
  decor: Decor;
  /** Render the surname in the muted tone, the way editorial layouts do. */
  nameTwoTone: boolean;
};

/** Philippine job market groupings used to filter the gallery. */
export type IndustryId =
  | "bpo"
  | "it"
  | "healthcare"
  | "maritime"
  | "education"
  | "finance"
  | "engineering"
  | "construction"
  | "hospitality"
  | "retail"
  | "logistics"
  | "va"
  | "marketing"
  | "government"
  | "manufacturing"
  | "legal"
  | "creative"
  | "aviation"
  | "agriculture"
  | "skilled-trades";

export const INDUSTRIES: { id: IndustryId; label: string }[] = [
  { id: "bpo", label: "BPO & Call Centre" },
  { id: "it", label: "IT & Software" },
  { id: "healthcare", label: "Healthcare & Nursing" },
  { id: "maritime", label: "Maritime & Seafaring" },
  { id: "education", label: "Education & Training" },
  { id: "finance", label: "Finance & Accounting" },
  { id: "engineering", label: "Engineering" },
  { id: "construction", label: "Construction" },
  { id: "hospitality", label: "Hospitality & F&B" },
  { id: "retail", label: "Retail & Sales" },
  { id: "logistics", label: "Logistics & Supply Chain" },
  { id: "va", label: "Virtual Assistant & Freelance" },
  { id: "marketing", label: "Marketing & Advertising" },
  { id: "government", label: "Government & Public Sector" },
  { id: "manufacturing", label: "Manufacturing & Production" },
  { id: "legal", label: "Legal" },
  { id: "creative", label: "Creative & Design" },
  { id: "aviation", label: "Aviation & Travel" },
  { id: "agriculture", label: "Agriculture & Agribusiness" },
  { id: "skilled-trades", label: "Skilled Trades & Technical" },
];

export type TemplateSpec = {
  id: string;
  name: string;
  blurb: string;
  engine: EngineId;
  side?: "left" | "right"; // sidebar / edge engines
  tokens: Tokens;
  industries: IndustryId[];
  /**
   * True when the text layer reads top-to-bottom in one column, which is what
   * an applicant tracking system parses. Two-column shapes are marked false —
   * they look better to a human and worse to a parser.
   */
  atsSafe: boolean;
};

/** Spacing scale, in em, derived from density. */
export const SPACING: Record<Density, { section: number; item: number; line: number }> = {
  tight: { section: 0.9, item: 0.55, line: 1.35 },
  normal: { section: 1.35, item: 0.85, line: 1.5 },
  airy: { section: 1.9, item: 1.15, line: 1.65 },
};

export const GLYPH: Record<BulletGlyph, string> = {
  dot: "•",
  dash: "–",
  square: "▪",
  chevron: "›",
  none: "",
};
