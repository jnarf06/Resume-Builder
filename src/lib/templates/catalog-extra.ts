import type { TemplateSpec } from "./types";
import { DARK, spec } from "./defaults";

/**
 * Designs built on the shape-led engines, plus the meter, dark-page and
 * decoration tokens. These are the showy ones — none are ATS-safe, so pair any
 * of them with a plain template from the main catalogue for online applications.
 */

const TEAL = "#0f766e";
const OCEAN = "#075985";
const AMBER = "#d97706";
const GOLD = "#eab308";
const CORAL = "#e11d48";
const VIOLET = "#6d28d9";
const SEA = "#0e7490";
const SAGE = "#5f7a61";
const CLAY = "#b45309";
const SKY = "#0284c7";
const NAVY = "#1e3a8a";
const BLUSH = "#be5a6a";

export const EXTRA_TEMPLATES: TemplateSpec[] = [
  /* --- wave: curved colour field ------------------------------------------ */
  spec({
    id: "lagoon",
    name: "Lagoon",
    blurb: "Teal field closed by a curve, photo in the header, skill bars below.",
    engine: "wave",
    industries: ["marketing", "creative", "bpo", "hospitality"],
    t: { accent: TEAL, surface: "#e6f2f1", meter: "bar", headingStyle: "chip", photo: "circle" },
  }),
  spec({
    id: "tide",
    name: "Tide",
    blurb: "Deep blue curve with star ratings. Corporate but not stiff.",
    engine: "wave",
    industries: ["finance", "bpo", "logistics", "retail"],
    t: { accent: OCEAN, meter: "stars", headingStyle: "boxed", photo: "circle", photoFrame: "framed" },
  }),
  spec({
    id: "shoreline",
    name: "Shoreline",
    blurb: "Sky curve, dotted skill ratings, geometric type.",
    engine: "wave",
    industries: ["it", "va", "marketing", "aviation"],
    t: { accent: SKY, font: "geometric", headingFont: "geometric", meter: "dots", headingStyle: "bar" },
  }),
  spec({
    id: "reef",
    name: "Reef",
    blurb: "Dark page under a teal curve. Reversed out, high contrast.",
    engine: "wave",
    industries: ["creative", "it", "marketing"],
    t: { ...DARK, accent: SEA, meter: "bar", headingStyle: "chip", photo: "circle" },
  }),

  /* --- modular: block grid -------------------------------------------------*/
  spec({
    id: "blocks",
    name: "Blocks",
    blurb: "Content broken into filled blocks. Skims like a dashboard.",
    engine: "modular",
    industries: ["it", "marketing", "va", "creative"],
    t: { accent: "#334155", surface: "#eef1f5", headingStyle: "plain", photo: "square", density: "tight" },
  }),
  spec({
    id: "high-vis",
    name: "High Vis",
    blurb: "Amber blocks on charcoal. Loud, in a useful way.",
    engine: "modular",
    industries: ["creative", "marketing", "skilled-trades", "manufacturing"],
    t: {
      ...DARK,
      accent: AMBER,
      onAccent: "#1c1917",
      headingStyle: "highlight",
      photo: "square",
      meter: "bar",
      density: "tight",
    },
  }),
  spec({
    id: "grid-work",
    name: "Grid Work",
    blurb: "Slab headings in a tight block grid. Technical and orderly.",
    engine: "modular",
    industries: ["engineering", "manufacturing", "construction", "logistics"],
    t: { accent: CLAY, headingFont: "slab", surface: "#f5efe8", photo: "square", bullet: "square", density: "tight" },
  }),
  spec({
    id: "panelboard",
    name: "Panelboard",
    blurb: "Navy blocks, dotted meters, condensed body. Fits a lot.",
    engine: "modular",
    industries: ["maritime", "aviation", "logistics", "it"],
    t: { accent: NAVY, font: "condensed", surface: "#eaeefb", meter: "dots", photo: "square", density: "tight" },
  }),

  /* --- editorial: magazine setting -----------------------------------------*/
  spec({
    id: "broadsheet",
    name: "Broadsheet",
    blurb: "Two-tone serif name over rules, magazine two-column body.",
    engine: "editorial",
    industries: ["creative", "marketing", "education", "legal"],
    t: {
      accent: "#1d4ed8",
      font: "serif",
      headingFont: "serif",
      nameTwoTone: true,
      nameUpper: false,
      nameSize: 3.2,
      nameWeight: 700,
      headingStyle: "plain",
      photo: "square",
      sidebarWidth: 38,
    },
  }),
  spec({
    id: "masthead",
    name: "Masthead",
    blurb: "Editorial setting in ink and coral. Portfolio-friendly.",
    engine: "editorial",
    industries: ["creative", "marketing", "va"],
    t: {
      accent: CORAL,
      font: "serif",
      headingFont: "serif",
      nameTwoTone: true,
      nameUpper: false,
      nameSize: 3.4,
      headingStyle: "highlight",
      photo: "square",
      sidebarWidth: 36,
    },
  }),
  spec({
    id: "gazette",
    name: "Gazette",
    blurb: "Sober editorial, no photo, dotted leaders on the headings.",
    engine: "editorial",
    industries: ["legal", "government", "education", "finance"],
    t: {
      accent: "#334155",
      font: "serif",
      headingFont: "serif",
      nameTwoTone: true,
      nameUpper: false,
      headingStyle: "leader",
      photo: "none",
      density: "airy",
      sidebarWidth: 34,
    },
  }),

  /* --- memphis: geometric decoration ---------------------------------------*/
  spec({
    id: "atelier-shapes",
    name: "Atelier Shapes",
    blurb: "Circles and offset frames behind a serif setting.",
    engine: "memphis",
    industries: ["creative", "marketing", "va"],
    t: {
      accent: SAGE,
      font: "serif",
      headingFont: "serif",
      headingStyle: "highlight",
      decor: "shapes",
      photo: "square",
      nameUpper: true,
      meter: "bar",
    },
  }),
  spec({
    id: "confetti",
    name: "Confetti",
    blurb: "Dot-grid furniture, geometric type, dotted skill ratings.",
    engine: "memphis",
    industries: ["creative", "marketing", "education", "va"],
    t: {
      accent: VIOLET,
      font: "geometric",
      headingFont: "geometric",
      headingStyle: "chip",
      decor: "dot-grid",
      meter: "dots",
      photo: "rounded",
    },
  }),
  spec({
    id: "corners",
    name: "Corners",
    blurb: "Accent triangles top and bottom. Quietly graphic.",
    engine: "memphis",
    industries: ["it", "engineering", "manufacturing", "creative"],
    t: { accent: "#0f766e", headingStyle: "sidelined", decor: "corner", photo: "square", density: "tight" },
  }),
  spec({
    id: "midnight-shapes",
    name: "Midnight Shapes",
    blurb: "Dark page with soft circles and star ratings.",
    engine: "memphis",
    industries: ["creative", "marketing", "it"],
    t: { ...DARK, accent: GOLD, onAccent: "#1c1917", headingStyle: "chip", decor: "shapes", meter: "stars" },
  }),

  /* --- split: colour field with the photo straddling it --------------------*/
  spec({
    id: "sunfield",
    name: "Sunfield",
    blurb: "Charcoal field under a pale header, portrait on the seam.",
    engine: "split",
    industries: ["creative", "marketing", "retail", "hospitality"],
    t: {
      accent: "#292524",
      onAccent: "#fef3c7",
      headingStyle: "bar",
      photo: "circle",
      photoFrame: "framed",
      meter: "dots",
    },
  }),
  spec({
    id: "harbour-split",
    name: "Harbour Split",
    blurb: "Navy field, framed portrait, bar meters. Corporate polish.",
    engine: "split",
    industries: ["finance", "bpo", "logistics", "maritime"],
    t: { accent: NAVY, headingStyle: "underline", photo: "circle", photoFrame: "framed", meter: "bar" },
  }),
  spec({
    id: "rosewater",
    name: "Rosewater",
    blurb: "Soft blush field with chip headings. Warm and personable.",
    engine: "split",
    industries: ["hospitality", "education", "healthcare", "retail"],
    t: {
      accent: BLUSH,
      headingStyle: "chip",
      photo: "circle",
      photoFrame: "framed",
      nameUpper: false,
      meter: "dots",
    },
  }),
  spec({
    id: "teal-field",
    name: "Teal Field",
    blurb: "Deep teal field, numbered sections, geometric type.",
    engine: "split",
    industries: ["healthcare", "it", "va", "aviation"],
    t: {
      accent: TEAL,
      font: "geometric",
      headingFont: "geometric",
      headingStyle: "numbered",
      photo: "circle",
      photoFrame: "framed",
    },
  }),

  /* --- numbered and metered takes on the classic shapes ---------------------*/
  spec({
    id: "enumerated",
    name: "Enumerated",
    blurb: "Numbered section badges down a dark sidebar, with skill bars.",
    engine: "sidebar",
    side: "left",
    industries: ["creative", "marketing", "bpo", "va"],
    t: {
      accent: GOLD,
      onAccent: "#1c1917",
      surface: "#26313f",
      ink: "#1f2937",
      headingStyle: "numbered",
      photo: "square",
      photoFrame: "arch",
      meter: "bar",
    },
  }),
  spec({
    id: "onyx",
    name: "Onyx",
    blurb: "Full dark page, amber edge strip, reversed-out type.",
    engine: "edge",
    side: "left",
    industries: ["creative", "it", "marketing", "skilled-trades"],
    t: { ...DARK, accent: AMBER, onAccent: "#1c1917", headingStyle: "underline", meter: "bar" },
  }),
  spec({
    id: "slate-dark",
    name: "Slate Dark",
    blurb: "Dark banner page with dotted meters. Reads well on screen.",
    engine: "banner",
    industries: ["it", "engineering", "va", "marketing"],
    t: { ...DARK, accent: SKY, headingStyle: "bar", meter: "dots", photo: "circle", photoFrame: "framed" },
  }),
  spec({
    id: "roll-call",
    name: "Roll Call",
    blurb: "Dotted leader headings and star ratings in a compact grid.",
    engine: "compact",
    industries: ["hospitality", "retail", "aviation", "bpo"],
    t: { accent: CLAY, headingStyle: "leader", meter: "stars", photo: "circle", density: "tight" },
  }),
];
