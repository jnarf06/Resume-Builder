/** An id from the catalogue in `lib/templates/catalog.ts`. */
export type TemplateId = string;

export type Basics = {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  photo: string; // data URL, empty when none
  summary: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  /** Where the job was based — "Makati City", "Remote", "Singapore". */
  location: string;
  start: string; // "Jul 2020"
  end: string; // "Present" or "Feb 2025"
  employment: "" | "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship";
  bullets: string[];
};

export type Education = {
  id: string;
  school: string;
  course: string;
  level: string; // "Tertiary" | "Secondary" | "Primary" | custom
  year: string;
};

export type Language = { id: string; name: string; level: string };

/**
 * `level` is 1–5, or null for "no rating". Templates that draw meters map it
 * onto their own scale; templates that do not simply print the name.
 */
export type Skill = { id: string; name: string; level: number | null };

/** One row in a custom section using the "entries" layout. */
export type CustomEntry = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  detail: string;
};

/**
 * A section the user invents: Certifications, Seminars & Trainings, Eligibility,
 * Awards, Projects, Volunteer Work — whatever the built-in sections do not cover.
 * Three layouts handle nearly everything people actually add.
 */
export type CustomSection = {
  id: string;
  title: string;
  layout: "bullets" | "text" | "entries";
  bullets: string[];
  text: string;
  entries: CustomEntry[];
  /** Two-column templates can take it in the sidebar instead of the main column. */
  placement: "main" | "side";
  /** Own heading colour; empty means follow the document accent. */
  color: string;
};

export const CUSTOM_LAYOUTS: { value: CustomSection["layout"]; label: string; hint: string }[] = [
  { value: "bullets", label: "Bullet list", hint: "Certifications, awards, eligibility" },
  { value: "text", label: "Paragraph", hint: "A short statement or objective" },
  { value: "entries", label: "Dated entries", hint: "Trainings, projects, seminars" },
];

export type Reference = {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
};

/**
 * Per-element colour overrides. Every field is optional: an absent or empty
 * value means "use whatever the template specifies", which is what keeps a
 * template switch from carrying the previous design's palette with it.
 */
export type ColorOverrides = {
  accent?: string;
  /** Sidebar, card and panel tint. */
  surface?: string;
  /** Body text. */
  ink?: string;
  /** Page background. */
  page?: string;
  /** Text sitting on an accent-filled area. */
  onAccent?: string;
};

export const COLOR_ROLES: { key: keyof ColorOverrides; label: string; hint: string }[] = [
  { key: "accent", label: "Accent", hint: "Headings, rules, bullets, banner fills" },
  { key: "surface", label: "Panel", hint: "Sidebar, card and block backgrounds" },
  { key: "page", label: "Page", hint: "The paper itself" },
  { key: "ink", label: "Body text", hint: "Paragraphs and bullet text" },
  { key: "onAccent", label: "On accent", hint: "Text sitting on a filled area" },
];

/** Resume sections that can carry their own heading colour. */
export type SectionId =
  | "profile"
  | "skills"
  | "experience"
  | "education"
  | "languages"
  | "references"
  | "contact";

export const SECTION_LABELS: Record<SectionId, string> = {
  profile: "Profile",
  skills: "Skills",
  experience: "Work experience",
  education: "Education",
  languages: "Languages",
  references: "References",
  contact: "Contact",
};

export type Settings = {
  template: TemplateId;
  /** @deprecated superseded by `colors.accent`; kept so old saves still load. */
  accent: string;
  colors: ColorOverrides;
  /**
   * Per-section heading colour. Unset sections follow `colors.accent`, so a
   * template switch still recolours everything you have not pinned.
   */
  sectionColors: Partial<Record<SectionId, string>>;
  showPhoto: boolean;
  showDeclaration: boolean;
  showReferences: boolean;
  hideReferenceContacts: boolean;
  showSignature: boolean;
  fontScale: number; // 0.85 - 1.15
};

export type Resume = {
  id: string;
  docName: string;
  updatedAt: number;
  settings: Settings;
  basics: Basics;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  references: Reference[];
  custom: CustomSection[];
  declaration: string;
};

export const uid = () => Math.random().toString(36).slice(2, 10);
