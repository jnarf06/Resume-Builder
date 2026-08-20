import type { Resume, Skill } from "./types";
import { uid } from "./types";
import { SAMPLE, BLANK } from "./seed";

const KEY = "rb.resumes.v1";
const ACTIVE = "rb.active.v1";
/**
 * Set once the visitor has been given the sample. Without it, "an empty
 * library" and "a first visit" are indistinguishable, so clearing your data
 * and reloading would silently hand the sample back.
 */
const SEEDED = "rb.seeded.v1";
/** Timestamp of the last JSON export, used to nudge for a backup. */
const EXPORTED = "rb.exported.v1";

/**
 * Private browsing and some locked-down configurations expose localStorage but
 * throw on write. Without this check the app looks like it is saving and
 * silently is not — the worst possible failure for a document editor.
 */
export function storageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "rb.probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function markExported() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPORTED, String(Date.now()));
}

export function lastExportedAt(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(EXPORTED) ?? 0);
}

/** Deep clone that works for our plain-JSON resume shape. */
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function newResume(from: "sample" | "blank" = "blank"): Resume {
  const base = clone(from === "sample" ? SAMPLE : BLANK);
  return { ...base, id: uid(), updatedAt: Date.now() };
}

/**
 * The first version shipped two hard-coded templates. Anything saved back then
 * carries those ids, so map them onto their nearest equivalents in the
 * catalogue rather than falling back to the default and losing the choice.
 */
const LEGACY_TEMPLATES: Record<string, string> = {
  classic: "ortigas",
  ats: "manila-plain",
};

/** Old shape: "Google Ads | 4". New shape: { name, level }. */
function migrateSkill(raw: unknown): Skill {
  if (raw && typeof raw === "object" && "name" in raw) {
    const s = raw as Partial<Skill>;
    return { id: s.id ?? uid(), name: s.name ?? "", level: s.level ?? null };
  }
  const text = String(raw ?? "");
  const m = text.match(/^(.*?)\s*\|\s*(\d{1,3})\s*(?:\/\s*(\d{1,3}))?\s*$/);
  if (!m) return { id: uid(), name: text.trim(), level: null };
  const value = Number(m[2]);
  const outOf = m[3] ? Number(m[3]) : value > 5 ? 100 : 5;
  return { id: uid(), name: m[1].trim(), level: Math.max(1, Math.round((value / outOf) * 5)) };
}

/**
 * Brings any previously saved, imported or shared resume up to the current
 * shape. Anything reaching the app from outside goes through here.
 */
export function migrate(r: Resume): Resume {
  const settings = { ...r.settings };

  // v1 shipped two hard-coded template ids; map them onto the catalogue rather
  // than silently falling back to the default and losing the choice.
  const mapped = LEGACY_TEMPLATES[settings.template];
  if (mapped) {
    settings.template = mapped;
    settings.accent = "";
  }

  // v2 had a single `accent` string; colours are per-role now.
  if (!settings.colors) settings.colors = settings.accent ? { accent: settings.accent } : {};
  if (!settings.sectionColors) settings.sectionColors = {};

  return {
    ...r,
    settings,
    skills: Array.isArray(r.skills) ? r.skills.map(migrateSkill) : [],
  };
}

/** A copy with a fresh id and name, ready to add to the library. */
export function duplicateResume(r: Resume): Resume {
  return { ...clone(r), id: uid(), docName: `${r.docName} (copy)`, updatedAt: Date.now() };
}

export function loadAll(): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Resume[]).map(migrate) : [];
  } catch {
    return [];
  }
}

export function saveAll(list: Resume[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Quota is the realistic failure here — a large photo data URL.
    console.warn("Could not save: browser storage is full. Try a smaller photo.");
  }
}

export function getActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE);
}

export function setActiveId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE, id);
}

/**
 * A genuine first visit gets the sample resume so the templates have something
 * to render. An empty library after that is a deliberate choice — leave it
 * empty and let the dashboard's empty state do the talking.
 */
export function bootstrap(): { list: Resume[]; activeId: string } {
  let list = loadAll();
  const firstVisit = typeof window !== "undefined" && !window.localStorage.getItem(SEEDED);

  if (list.length === 0 && firstVisit) {
    list = [newResume("sample")];
    saveAll(list);
    setActiveId(list[0].id);
  }
  if (typeof window !== "undefined") window.localStorage.setItem(SEEDED, "1");

  const stored = getActiveId();
  const activeId = list.some((r) => r.id === stored) ? (stored as string) : (list[0]?.id ?? "");
  return { list, activeId };
}

/**
 * Swap a resume's *content* for the sample, keeping its template, colours and
 * format toggles. Useful for filling a design with realistic text — and for
 * clearing personal details out of a document you are about to show someone.
 */
export function withSampleContent(r: Resume): Resume {
  const s = clone(SAMPLE);
  return {
    ...r,
    basics: s.basics,
    skills: s.skills,
    experience: s.experience,
    education: s.education,
    languages: s.languages,
    references: s.references,
    declaration: s.declaration,
    updatedAt: Date.now(),
  };
}

/** Remove every resume from this browser. Irreversible — confirm before calling. */
export function clearAll() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(ACTIVE);
  // Keep the seeded flag so the wipe survives a reload.
  window.localStorage.setItem(SEEDED, "1");
}

export function exportJson(resume: Resume) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${resume.docName.replace(/[^\w\s-]/g, "").trim() || "resume"}.json`;
  a.click();
  URL.revokeObjectURL(url);
  markExported();
}

export async function importJson(file: File): Promise<Resume> {
  const text = await file.text();
  const data = JSON.parse(text) as Resume;
  if (!data || typeof data !== "object" || !data.basics) throw new Error("Not a resume file");
  return migrate({ ...data, id: uid(), updatedAt: Date.now() });
}

/**
 * Downscale an uploaded photo before it goes into localStorage — a raw phone
 * photo is several MB of base64 and blows the 5MB quota on its own.
 */
export function readPhoto(file: File, max = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not an image"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
