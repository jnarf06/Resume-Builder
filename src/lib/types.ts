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

export type Reference = {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
};

export type Settings = {
  template: TemplateId;
  /** Empty string means "use the template's own accent". */
  accent: string;
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
  skills: string[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  references: Reference[];
  declaration: string;
};

export const uid = () => Math.random().toString(36).slice(2, 10);
