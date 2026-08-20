import type { Resume } from "./types";

export type Issue = {
  id: string;
  level: "error" | "warn" | "tip";
  title: string;
  detail: string;
};

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** "Jul 2020" / "July 2020" / "2020" -> months since year 0. "Present" -> now. */
export function toMonths(value: string): number | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  if (v === "present" || v === "current" || v === "now") {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const year = v.match(/\b(19|20)\d{2}\b/);
  if (!year) return null;
  const mi = MONTHS.findIndex((m) => v.includes(m));
  return Number(year[0]) * 12 + (mi >= 0 ? mi : 0);
}

const overlapMonths = (aS: number, aE: number, bS: number, bE: number) =>
  Math.max(0, Math.min(aE, bE) - Math.max(aS, bS));

/**
 * Text that gets shipped by accident: sample content from this app, plus the
 * stock strings Canva and Word templates leave behind.
 */
const PLACEHOLDERS = [
  // this app's sample resume
  "juan dela cruz",
  "@example.com",
  "+63 917 000 0000",
  "linkedin.com/in/yourname",
  // common template leftovers
  "wardiere",
  "lorem ipsum",
  "your name",
  "real name",
  "borcelle",
  "salford & co",
  "fauget",
  "ingoude",
  "123 anywhere st",
  "hello@reallygreatsite.com",
];

const HAS_NUMBER = /\d|\b(doubled|tripled|halved)\b/i;
const WEAK_OPENERS =
  /^(responsible for|tasked with|helped with|worked on|assisted in|in charge of|duties include)/i;

export function auditResume(r: Resume): Issue[] {
  const issues: Issue[] = [];
  const push = (i: Issue) => issues.push(i);

  // --- contact completeness -------------------------------------------------
  const missing: string[] = [];
  if (!r.basics.fullName.trim()) missing.push("name");
  if (!r.basics.email.trim()) missing.push("email");
  if (!r.basics.phone.trim()) missing.push("phone");
  if (missing.length) {
    push({
      id: "contact",
      level: "error",
      title: `Missing ${missing.join(", ")}`,
      detail: "A recruiter cannot reach you. Fill these in before exporting.",
    });
  }
  if (r.basics.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.basics.email.trim())) {
    push({
      id: "email",
      level: "error",
      title: "Email address looks malformed",
      detail: `"${r.basics.email}" is not a valid address.`,
    });
  }

  // --- leftover template text ----------------------------------------------
  const haystack = JSON.stringify(r).toLowerCase();
  for (const p of PLACEHOLDERS) {
    if (haystack.includes(p)) {
      push({
        id: `placeholder-${p}`,
        level: "error",
        title: `Placeholder text still present: "${p}"`,
        detail:
          "This is sample or template content, not yours. Applicant tracking systems read the PDF's text layer even where it is hidden behind a design, so replace it before you export.",
      });
    }
  }

  // --- overlapping roles ----------------------------------------------------
  const dated = r.experience
    .map((e) => ({ e, s: toMonths(e.start), t: toMonths(e.end) }))
    .filter((x): x is { e: (typeof r.experience)[number]; s: number; t: number } => x.s !== null && x.t !== null);

  for (const x of dated) {
    if (x.t < x.s) {
      push({
        id: `reversed-${x.e.id}`,
        level: "error",
        title: `${x.e.company || "A role"}: end date is before the start date`,
        detail: `${x.e.start} → ${x.e.end}.`,
      });
    }
  }

  for (let i = 0; i < dated.length; i++) {
    for (let j = i + 1; j < dated.length; j++) {
      const a = dated[i];
      const b = dated[j];
      const months = overlapMonths(a.s, a.t, b.s, b.t);
      // A month or two of handover is normal; a sustained overlap is not.
      if (months <= 2) continue;
      const labelled = a.e.employment && b.e.employment && a.e.employment !== b.e.employment;
      if (labelled) continue;
      push({
        id: `overlap-${a.e.id}-${b.e.id}`,
        level: "warn",
        title: `${a.e.company} and ${b.e.company} overlap by ~${months} months`,
        detail:
          "Set the employment type (Freelance, Part-time, Contract) on at least one of them so the overlap reads as intentional rather than as a mistake.",
      });
    }
  }

  // --- employment gaps ------------------------------------------------------
  const sorted = [...dated].sort((a, b) => a.s - b.s);
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = Math.max(...sorted.slice(0, i).map((x) => x.t));
    const gap = sorted[i].s - prevEnd;
    if (gap >= 6) {
      push({
        id: `gap-${sorted[i].e.id}`,
        level: "tip",
        title: `~${gap}-month gap before ${sorted[i].e.company}`,
        detail: "Be ready to explain it, or cover it with freelance or study entries if that is accurate.",
      });
    }
  }

  // --- bullet quality -------------------------------------------------------
  const allBullets = r.experience.flatMap((e) => e.bullets.map((b) => ({ b, e })));
  const withNumbers = allBullets.filter((x) => HAS_NUMBER.test(x.b));
  if (allBullets.length >= 4 && withNumbers.length / allBullets.length < 0.25) {
    push({
      id: "metrics",
      level: "warn",
      title: `Only ${withNumbers.length} of ${allBullets.length} bullets contain a number`,
      detail:
        "Duties are forgettable; results are not. Add spend managed, ROAS or CPA change, traffic or revenue growth, team size, and number of markets.",
    });
  }

  for (const x of allBullets) {
    if (WEAK_OPENERS.test(x.b)) {
      push({
        id: `weak-${x.e.id}-${x.b.slice(0, 12)}`,
        level: "tip",
        title: `Weak opener in ${x.e.company}`,
        detail: `"${x.b.slice(0, 60)}…" — start with a verb that shows ownership: Led, Built, Cut, Grew, Launched.`,
      });
    }
    if (x.b.length > 240) {
      push({
        id: `long-${x.e.id}-${x.b.slice(0, 12)}`,
        level: "tip",
        title: `Very long bullet in ${x.e.company}`,
        detail: "Over two lines stops being scannable. Split it or cut it.",
      });
    }
  }

  for (const e of r.experience) {
    if (e.bullets.filter((b) => b.trim()).length === 0) {
      push({
        id: `empty-${e.id}`,
        level: "warn",
        title: `${e.company || "A role"} has no bullets`,
        detail: "An entry with no content is worse than no entry.",
      });
    }
  }

  // --- summary --------------------------------------------------------------
  const words = r.basics.summary.trim().split(/\s+/).filter(Boolean).length;
  if (words > 0 && words < 25) {
    push({
      id: "summary-short",
      level: "tip",
      title: "Profile is very short",
      detail: "Three to five sentences: what you do, seniority, industry, and your strongest result.",
    });
  }
  if (words > 110) {
    push({
      id: "summary-long",
      level: "tip",
      title: `Profile is ${words} words`,
      detail: "Keep it under about 100 — this is the one block recruiters actually read, so it has to be tight.",
    });
  }

  // --- skills ---------------------------------------------------------------
  if (r.skills.length > 22) {
    push({
      id: "skills-many",
      level: "tip",
      title: `${r.skills.length} skills listed`,
      detail: "Past roughly 20 the list stops signalling depth. Cut the ones any candidate could claim.",
    });
  }

  // --- Philippine-format conventions ---------------------------------------
  const nonTertiary = r.education.filter((e) => /primary|secondary|elementary|high school/i.test(e.level + " " + e.school));
  if (nonTertiary.length && r.experience.length >= 3) {
    push({
      id: "education-basic",
      level: "tip",
      title: "Primary and secondary school are still listed",
      detail:
        "With this much work history they add nothing — even locally. Reclaim the space for results.",
    });
  }
  if (r.settings.showReferences && !r.settings.hideReferenceContacts && r.references.some((x) => x.phone || x.email)) {
    push({
      id: "reference-contacts",
      level: "tip",
      title: "Reference phone numbers are printed on the resume",
      detail:
        "Normal in the Philippines, but it exposes their numbers to every recruiter and job board. Toggle “Hide contact details” unless the employer asked for them.",
    });
  }

  return issues;
}

export function scoreOf(issues: Issue[]): number {
  const penalty = issues.reduce(
    (sum, i) => sum + (i.level === "error" ? 18 : i.level === "warn" ? 9 : 3),
    0,
  );
  return Math.max(0, Math.min(100, 100 - penalty));
}
