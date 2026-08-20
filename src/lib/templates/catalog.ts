import type { IndustryId, TemplateSpec } from "./types";
import { spec } from "./defaults";
import { EXTRA_TEMPLATES } from "./catalog-extra";

/* Palettes ---------------------------------------------------------------- */
const NAVY = "#1f3a5f";
const SLATE = "#3d4a5c";
const INK = "#0f172a";
const TEAL = "#0f766e";
const FOREST = "#14532d";
const MAROON = "#7c2d12";
const PLUM = "#4c1d95";
const BURGUNDY = "#7f1d1d";
const STEEL = "#334155";
const OCEAN = "#075985";
const OLIVE = "#3f6212";
const CHARCOAL = "#262626";
const INDIGO = "#312e81";
const RUST = "#9a3412";
const GRAPHITE = "#1f2937";
const MOSS = "#365314";
const WINE = "#831843";
const BRONZE = "#78350f";
const GOLD = "#854d0e";

/* -------------------------------------------------------------------------- */
/* The catalogue                                                              */
/* -------------------------------------------------------------------------- */

export const TEMPLATES: TemplateSpec[] = [
  /* --- stack: plain single column, the safest thing you can upload -------- */
  spec({
    id: "manila-plain",
    name: "Manila Plain",
    blurb: "Single column, no colour. The safest thing to upload to a job portal.",
    engine: "stack",
    industries: ["bpo", "finance", "government", "legal", "it", "logistics"],
    t: { accent: INK, headingStyle: "underline", photo: "none", nameSize: 2.3, density: "tight" },
  }),
  spec({
    id: "civil-service",
    name: "Civil Service",
    blurb: "Formal serif, generous rules. Reads like an official document.",
    engine: "stack",
    industries: ["government", "legal", "education", "finance"],
    t: {
      accent: INK,
      font: "serif",
      headingFont: "serif",
      headingStyle: "ruled",
      photo: "none",
      nameUpper: false,
      nameSize: 2.4,
      nameWeight: 700,
    },
  }),
  spec({
    id: "parser-first",
    name: "Parser First",
    blurb: "Maximum density, inline skills, zero ornament. Built for keyword scanning.",
    engine: "stack",
    industries: ["it", "bpo", "va", "logistics", "marketing"],
    t: { accent: GRAPHITE, headingStyle: "plain", photo: "none", density: "tight", skillsInline: true, nameSize: 2.1 },
  }),
  spec({
    id: "clinical-record",
    name: "Clinical Record",
    blurb: "Clean and impersonal, the way hospital HR files like them.",
    engine: "stack",
    industries: ["healthcare", "government"],
    t: { accent: TEAL, headingStyle: "underline", photo: "none", bullet: "square", density: "tight" },
  }),
  spec({
    id: "ledger",
    name: "Ledger",
    blurb: "Ruled headings and tight columns. Accountancy without the flourish.",
    engine: "stack",
    industries: ["finance", "legal", "government"],
    t: { accent: NAVY, font: "serif", headingStyle: "ruled", photo: "none", bullet: "dash", density: "tight" },
  }),
  spec({
    id: "deck-log",
    name: "Deck Log",
    blurb: "Condensed type so a long sea-service record still fits.",
    engine: "stack",
    industries: ["maritime", "logistics", "aviation"],
    t: { accent: OCEAN, font: "condensed", headingStyle: "underline", photo: "none", density: "tight", bullet: "dash" },
  }),
  spec({
    id: "site-report",
    name: "Site Report",
    blurb: "Slab headings, plain body. Trade certifications read clearly.",
    engine: "stack",
    industries: ["construction", "engineering", "skilled-trades", "manufacturing"],
    t: { accent: BRONZE, headingFont: "slab", headingStyle: "bar", photo: "none", bullet: "square" },
  }),
  spec({
    id: "shift-sheet",
    name: "Shift Sheet",
    blurb: "Short, scannable, no photo. For high-volume hiring.",
    engine: "stack",
    industries: ["retail", "hospitality", "bpo", "manufacturing"],
    t: { accent: CHARCOAL, headingStyle: "plain", photo: "none", density: "tight", skillsInline: true },
  }),

  /* --- centered: name centred, rules across --------------------------------*/
  spec({
    id: "quezon",
    name: "Quezon",
    blurb: "Centred name over a full-width rule. Quietly formal.",
    engine: "centered",
    industries: ["government", "education", "finance", "legal"],
    t: { accent: NAVY, headingStyle: "ruled", photo: "none", nameUpper: true, nameSize: 2.7 },
  }),
  spec({
    id: "faculty",
    name: "Faculty",
    blurb: "Serif throughout, wide margins. Academic in tone.",
    engine: "centered",
    industries: ["education", "government", "healthcare"],
    t: {
      accent: MOSS,
      font: "serif",
      headingFont: "serif",
      headingStyle: "underline",
      photo: "none",
      nameUpper: false,
      density: "airy",
    },
  }),
  spec({
    id: "chambers",
    name: "Chambers",
    blurb: "Small caps headings and hairline rules. Law-firm restraint.",
    engine: "centered",
    industries: ["legal", "finance", "government"],
    t: { accent: BURGUNDY, font: "serif", headingStyle: "ruled", photo: "none", headingTracking: 0.22, density: "airy" },
  }),
  spec({
    id: "monolith",
    name: "Monolith",
    blurb: "Oversized name, everything else small. High contrast.",
    engine: "centered",
    industries: ["creative", "marketing", "it"],
    t: { accent: INK, headingStyle: "plain", photo: "none", nameSize: 3.6, headingTracking: 0.3, density: "airy" },
  }),
  spec({
    id: "clinic-card",
    name: "Clinic Card",
    blurb: "Centred header with a photo, clinical palette below.",
    engine: "centered",
    industries: ["healthcare", "hospitality", "education"],
    t: { accent: TEAL, photo: "circle", headingStyle: "bar", nameUpper: false },
  }),
  spec({
    id: "atrium",
    name: "Atrium",
    blurb: "Geometric type, lots of air. Modern without colour blocks.",
    engine: "centered",
    industries: ["it", "marketing", "creative", "va"],
    t: { accent: STEEL, font: "geometric", headingFont: "geometric", headingStyle: "plain", photo: "none", density: "airy" },
  }),

  /* --- banner: full-width accent header ------------------------------------*/
  spec({
    id: "makati",
    name: "Makati",
    blurb: "Corporate navy banner, disciplined single column beneath.",
    engine: "banner",
    industries: ["finance", "bpo", "logistics", "retail", "marketing"],
    t: { accent: NAVY, photo: "none", headingStyle: "underline" },
  }),
  spec({
    id: "bgc",
    name: "BGC",
    blurb: "Wide banner with the photo inset. Polished and corporate.",
    engine: "banner",
    industries: ["bpo", "finance", "marketing", "retail"],
    t: { accent: SLATE, photo: "circle", headingStyle: "bar" },
  }),
  spec({
    id: "harbour",
    name: "Harbour",
    blurb: "Deep ocean banner, condensed body. Suits long service records.",
    engine: "banner",
    industries: ["maritime", "logistics", "aviation", "engineering"],
    t: { accent: OCEAN, font: "condensed", photo: "square", density: "tight", bullet: "dash" },
  }),
  spec({
    id: "greenfield",
    name: "Greenfield",
    blurb: "Forest banner with slab headings. Grounded and practical.",
    engine: "banner",
    industries: ["agriculture", "construction", "manufacturing", "engineering"],
    t: { accent: FOREST, headingFont: "slab", photo: "none", bullet: "square" },
  }),
  spec({
    id: "ward",
    name: "Ward",
    blurb: "Teal banner, roomy spacing. Reads calm.",
    engine: "banner",
    industries: ["healthcare", "education", "hospitality"],
    t: { accent: TEAL, photo: "circle", density: "airy", headingStyle: "bar" },
  }),
  spec({
    id: "studio-band",
    name: "Studio Band",
    blurb: "Plum banner and geometric type. Creative but still legible.",
    engine: "banner",
    industries: ["creative", "marketing", "va"],
    t: { accent: PLUM, font: "geometric", headingFont: "geometric", photo: "rounded", headingStyle: "boxed" },
  }),
  spec({
    id: "foundry",
    name: "Foundry",
    blurb: "Rust banner, square bullets, industrial weight.",
    engine: "banner",
    industries: ["manufacturing", "skilled-trades", "construction", "logistics"],
    t: { accent: RUST, headingFont: "slab", photo: "none", bullet: "square", density: "tight" },
  }),

  /* --- sidebar left --------------------------------------------------------*/
  spec({
    id: "ortigas",
    name: "Ortigas",
    blurb: "Classic tinted sidebar with a circular photo. The familiar shape.",
    engine: "sidebar",
    side: "left",
    industries: ["bpo", "marketing", "retail", "hospitality", "va"],
    t: { accent: SLATE, photo: "circle" },
  }),
  spec({
    id: "meridian",
    name: "Meridian",
    blurb: "Navy sidebar, boxed headings, square photo.",
    engine: "sidebar",
    side: "left",
    industries: ["finance", "logistics", "engineering", "it"],
    t: { accent: NAVY, photo: "square", headingStyle: "boxed", surface: "#e8edf3" },
  }),
  spec({
    id: "bayanihan",
    name: "Bayanihan",
    blurb: "Warm maroon sidebar. Approachable rather than corporate.",
    engine: "sidebar",
    side: "left",
    industries: ["education", "hospitality", "retail", "government"],
    t: { accent: MAROON, photo: "circle", surface: "#f4ede9", headingStyle: "bar" },
  }),
  spec({
    id: "vitals",
    name: "Vitals",
    blurb: "Teal sidebar with dense skill list. Built for licences and certifications.",
    engine: "sidebar",
    side: "left",
    industries: ["healthcare", "maritime", "aviation"],
    t: { accent: TEAL, photo: "circle", surface: "#e6f2f1", density: "tight", bullet: "square" },
  }),
  spec({
    id: "helm",
    name: "Helm",
    blurb: "Wide sidebar for certificates, condensed main column.",
    engine: "sidebar",
    side: "left",
    industries: ["maritime", "aviation", "logistics"],
    t: { accent: OCEAN, font: "condensed", photo: "square", sidebarWidth: 38, density: "tight" },
  }),
  spec({
    id: "atelier",
    name: "Atelier",
    blurb: "Plum sidebar, geometric type, rounded portrait.",
    engine: "sidebar",
    side: "left",
    industries: ["creative", "marketing", "va"],
    t: { accent: PLUM, font: "geometric", headingFont: "geometric", photo: "rounded", surface: "#f0ecf8" },
  }),
  spec({
    id: "granary",
    name: "Granary",
    blurb: "Olive sidebar with slab headings. Field-work friendly.",
    engine: "sidebar",
    side: "left",
    industries: ["agriculture", "manufacturing", "construction"],
    t: { accent: OLIVE, headingFont: "slab", photo: "square", surface: "#eef1e7", bullet: "square" },
  }),
  spec({
    id: "concierge",
    name: "Concierge",
    blurb: "Gold sidebar, serif headings. Front-of-house polish.",
    engine: "sidebar",
    side: "left",
    industries: ["hospitality", "retail", "aviation"],
    t: { accent: GOLD, headingFont: "serif", photo: "circle", surface: "#f6f1e6" },
  }),

  /* --- sidebar right -------------------------------------------------------*/
  spec({
    id: "reverso",
    name: "Reverso",
    blurb: "Sidebar on the right so experience leads the eye.",
    engine: "sidebar",
    side: "right",
    industries: ["it", "marketing", "bpo", "va"],
    t: { accent: STEEL, photo: "none", headingStyle: "bar" },
  }),
  spec({
    id: "console",
    name: "Console",
    blurb: "Right rail of tools and stacks, experience on the left.",
    engine: "sidebar",
    side: "right",
    industries: ["it", "engineering", "manufacturing"],
    t: { accent: GRAPHITE, photo: "none", surface: "#eceef1", density: "tight", skillsInline: false, bullet: "chevron" },
  }),
  spec({
    id: "portfolio-rail",
    name: "Portfolio Rail",
    blurb: "Indigo right rail with a rounded portrait.",
    engine: "sidebar",
    side: "right",
    industries: ["creative", "marketing", "va"],
    t: { accent: INDIGO, photo: "rounded", surface: "#eeeefa", font: "geometric" },
  }),
  spec({
    id: "bedside",
    name: "Bedside",
    blurb: "Right-hand column for licences, wide main column for duties.",
    engine: "sidebar",
    side: "right",
    industries: ["healthcare", "education"],
    t: { accent: TEAL, photo: "circle", surface: "#e9f3f2", sidebarWidth: 30 },
  }),
  spec({
    id: "counsel",
    name: "Counsel",
    blurb: "Serif body with a restrained right rail. Sober.",
    engine: "sidebar",
    side: "right",
    industries: ["legal", "finance", "government"],
    t: { accent: BURGUNDY, font: "serif", headingFont: "serif", photo: "none", surface: "#f4eeee", nameUpper: false },
  }),

  /* --- timeline ------------------------------------------------------------*/
  spec({
    id: "throughline",
    name: "Throughline",
    blurb: "A rail down the experience list. Shows progression at a glance.",
    engine: "timeline",
    industries: ["bpo", "marketing", "it", "retail"],
    t: { accent: SLATE, photo: "none" },
  }),
  spec({
    id: "watch-keeping",
    name: "Watch Keeping",
    blurb: "Timeline with condensed type. Contract-by-contract careers read well.",
    engine: "timeline",
    industries: ["maritime", "logistics", "aviation", "construction"],
    t: { accent: OCEAN, font: "condensed", photo: "none", density: "tight", bullet: "dash" },
  }),
  spec({
    id: "tenure",
    name: "Tenure",
    blurb: "Serif timeline with airy spacing. Long, stable careers.",
    engine: "timeline",
    industries: ["education", "government", "healthcare", "legal"],
    t: { accent: MOSS, font: "serif", headingFont: "serif", photo: "none", density: "airy", nameUpper: false },
  }),
  spec({
    id: "sprint",
    name: "Sprint",
    blurb: "Chevron markers, tight rhythm. Fast-moving tech careers.",
    engine: "timeline",
    industries: ["it", "marketing", "va", "creative"],
    t: { accent: INDIGO, font: "geometric", photo: "none", bullet: "chevron", density: "tight" },
  }),
  spec({
    id: "linework",
    name: "Linework",
    blurb: "Bronze rail, slab headings. Trade and site history.",
    engine: "timeline",
    industries: ["skilled-trades", "construction", "manufacturing", "engineering"],
    t: { accent: BRONZE, headingFont: "slab", photo: "none", bullet: "square" },
  }),

  /* --- cards ---------------------------------------------------------------*/
  spec({
    id: "tiles",
    name: "Tiles",
    blurb: "Every section in its own bordered card. Very easy to skim.",
    engine: "cards",
    industries: ["bpo", "va", "retail", "hospitality"],
    t: { accent: STEEL, photo: "none", headingStyle: "plain", surface: "#f6f7f9" },
  }),
  spec({
    id: "dispatch",
    name: "Dispatch",
    blurb: "Cards with slab headings. Operational and direct.",
    engine: "cards",
    industries: ["logistics", "manufacturing", "construction"],
    t: { accent: RUST, headingFont: "slab", photo: "none", bullet: "square", density: "tight" },
  }),
  spec({
    id: "casebook",
    name: "Casebook",
    blurb: "Serif cards, wide gutters. Considered and formal.",
    engine: "cards",
    industries: ["legal", "education", "finance"],
    t: { accent: WINE, font: "serif", headingFont: "serif", photo: "none", density: "airy", nameUpper: false },
  }),
  spec({
    id: "kiosk",
    name: "Kiosk",
    blurb: "Compact cards with a photo. Customer-facing roles.",
    engine: "cards",
    industries: ["retail", "hospitality", "aviation", "bpo"],
    t: { accent: GOLD, photo: "circle", density: "tight", headingStyle: "bar" },
  }),
  spec({
    id: "lab-notes",
    name: "Lab Notes",
    blurb: "Teal cards, square bullets. Clinical and technical detail.",
    engine: "cards",
    industries: ["healthcare", "engineering", "agriculture"],
    t: { accent: TEAL, photo: "none", bullet: "square", headingStyle: "sidelined" },
  }),

  /* --- edge ----------------------------------------------------------------*/
  spec({
    id: "margin",
    name: "Margin",
    blurb: "A thin accent strip down the left edge. Colour without a colour block.",
    engine: "edge",
    side: "left",
    industries: ["it", "marketing", "finance", "va"],
    t: { accent: INK, photo: "none", headingStyle: "sidelined" },
  }),
  spec({
    id: "spine",
    name: "Spine",
    blurb: "Edge strip with geometric type. Contemporary and quiet.",
    engine: "edge",
    side: "left",
    industries: ["creative", "it", "marketing"],
    t: { accent: INDIGO, font: "geometric", headingFont: "geometric", photo: "none", density: "airy" },
  }),
  spec({
    id: "keel",
    name: "Keel",
    blurb: "Right-edge strip, condensed body. Dense records, small footprint.",
    engine: "edge",
    side: "right",
    industries: ["maritime", "logistics", "manufacturing"],
    t: { accent: OCEAN, font: "condensed", photo: "none", density: "tight", bullet: "dash" },
  }),
  spec({
    id: "verdigris",
    name: "Verdigris",
    blurb: "Moss edge with serif headings. Understated.",
    engine: "edge",
    side: "left",
    industries: ["agriculture", "education", "government"],
    t: { accent: MOSS, headingFont: "serif", photo: "none", nameUpper: false },
  }),

  /* --- compact: main column plus a two-up grid for short sections ----------*/
  spec({
    id: "one-pager",
    name: "One Pager",
    blurb: "Squeezes education, skills and languages into a grid to save a page.",
    engine: "compact",
    industries: ["bpo", "retail", "hospitality", "va", "logistics"],
    t: { accent: SLATE, photo: "none", density: "tight", headingStyle: "underline" },
  }),
  spec({
    id: "brief",
    name: "Brief",
    blurb: "Inline skills and a tight grid. Fits a long history on one page.",
    engine: "compact",
    industries: ["finance", "legal", "government", "it"],
    t: { accent: NAVY, photo: "none", density: "tight", skillsInline: true, headingStyle: "ruled" },
  }),
  spec({
    id: "roster",
    name: "Roster",
    blurb: "Grid footer for certifications and languages. Crew-friendly.",
    engine: "compact",
    industries: ["maritime", "aviation", "healthcare", "skilled-trades"],
    t: { accent: OCEAN, font: "condensed", photo: "square", density: "tight", bullet: "dash" },
  }),
  spec({
    id: "workbench",
    name: "Workbench",
    blurb: "Slab headings over a compact grid. Technical roles.",
    engine: "compact",
    industries: ["engineering", "manufacturing", "skilled-trades", "construction"],
    t: { accent: BRONZE, headingFont: "slab", photo: "none", bullet: "square", density: "tight" },
  }),
  spec({
    id: "campus",
    name: "Campus",
    blurb: "Serif compact layout. Teaching and training histories.",
    engine: "compact",
    industries: ["education", "government", "healthcare"],
    t: { accent: MOSS, font: "serif", headingFont: "serif", photo: "circle", nameUpper: false },
  }),
  spec({
    id: "storefront",
    name: "Storefront",
    blurb: "Warm palette, photo, compact grid. Retail and service floors.",
    engine: "compact",
    industries: ["retail", "hospitality", "bpo"],
    t: { accent: MAROON, photo: "circle", density: "tight", headingStyle: "bar" },
  }),
];

/** The shape-led designs live in their own file; the gallery sees one list. */
export const ALL_TEMPLATES: TemplateSpec[] = [...TEMPLATES, ...EXTRA_TEMPLATES];

export const TEMPLATES_BY_ID = new Map(ALL_TEMPLATES.map((t) => [t.id, t]));

export const DEFAULT_TEMPLATE_ID = "ortigas";

export function getTemplate(id: string) {
  return TEMPLATES_BY_ID.get(id) ?? TEMPLATES_BY_ID.get(DEFAULT_TEMPLATE_ID)!;
}

/** Templates carrying a given industry tag, most-relevant engines first. */
export function templatesFor(industry: IndustryId | "all") {
  if (industry === "all") return ALL_TEMPLATES;
  return ALL_TEMPLATES.filter((t) => t.industries.includes(industry));
}
