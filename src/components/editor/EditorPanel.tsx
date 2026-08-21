"use client";

import { useRef } from "react";
import type { Education, Experience, Language, Reference, Resume } from "@/lib/types";
import { uid } from "@/lib/types";
import { readPhoto } from "@/lib/storage";
import { HINTS, MOCK } from "@/lib/seed";
import { getTemplate } from "@/lib/templates/catalog";
import PagePreview from "@/components/templates/PagePreview";
import { Accordion, Button, ItemControls, Select, Text, TextArea, Toggle } from "./Fields";
import ColorPicker from "./ColorPicker";
import SkillsEditor from "./SkillsEditor";
import SectionColor from "./SectionColor";

type Patch = (fn: (draft: Resume) => void) => void;

const EMPLOYMENT = [
  { value: "", label: "— not specified —" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
];

/** Move an item within an array, in place. */
function move<T>(arr: T[], from: number, to: number) {
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
}

/**
 * Every "+ Add" button sits *above* its list and every add prepends, so the new
 * entry appears directly under the button you just pressed. It also matches how
 * a resume is ordered: most recent first.
 *
 * The scroll is a safety net for a long list — click handlers flush
 * synchronously, so a 0ms timeout runs after React has committed the new row.
 */
function reveal(id: string) {
  setTimeout(() => {
    document.getElementById(`item-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, 0);
}

export default function EditorPanel({
  r,
  patch,
  onBrowseTemplates,
}: {
  r: Resume;
  patch: Patch;
  onBrowseTemplates: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const spec = getTemplate(r.settings.template);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    try {
      const data = await readPhoto(file);
      patch((d) => {
        d.basics.photo = data;
        d.settings.showPhoto = true;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not load that image");
    }
  }

  return (
    <div className="divide-y divide-slate-200">
      {/* ------------------------------------------------ design */}
      <Accordion title="Design & format" defaultOpen>
        <div>
          <span className="mb-1 block text-xs font-medium text-slate-600">Template</span>
          <button
            type="button"
            onClick={onBrowseTemplates}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-300 p-2.5 text-left transition hover:border-slate-500 hover:bg-slate-50"
          >
            <span className="shrink-0 overflow-hidden rounded border border-slate-200" aria-hidden>
              <PagePreview r={MOCK} templateId={spec.id} width={40} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-800">{spec.name}</span>
              <span className="block truncate text-xs text-slate-500">{spec.blurb}</span>
            </span>
            <span className="shrink-0 text-xs font-medium text-slate-400">Browse ›</span>
          </button>
        </div>

        <p
          className={`rounded-md px-3 py-2 text-xs leading-relaxed ${
            spec.atsSafe ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
          }`}
        >
          {spec.atsSafe
            ? "Single column — the text layer reads top-to-bottom, so a job portal will parse it correctly."
            : "Two columns. Looks better to a person, but a job portal may interleave the sidebar into your job bullets. Keep an ATS-safe version for online applications."}
        </p>

        <ColorPicker r={r} patch={patch} />

        <label className="block">
          <span className="mb-1 flex justify-between text-xs font-medium text-slate-600">
            <span>Text size</span>
            <span className="text-slate-400">{Math.round(r.settings.fontScale * 100)}%</span>
          </span>
          <input
            type="range"
            min={0.85}
            max={1.15}
            step={0.01}
            value={r.settings.fontScale}
            onChange={(e) => patch((d) => void (d.settings.fontScale = Number(e.target.value)))}
            className="w-full accent-slate-700"
          />
        </label>

        <div className="pt-1">
          <Toggle
            label="Show photo"
            checked={r.settings.showPhoto}
            onChange={(v) => patch((d) => void (d.settings.showPhoto = v))}
            hint={
              spec.tokens.photo === "none"
                ? `"${spec.name}" is a no-photo design — pick another template to show one.`
                : "Standard in the Philippines. Remove it for US, UK or Australian applications."
            }
          />
          <Toggle
            label="Show references"
            checked={r.settings.showReferences}
            onChange={(v) => patch((d) => void (d.settings.showReferences = v))}
          />
          <Toggle
            label="Hide reference contact details"
            checked={r.settings.hideReferenceContacts}
            onChange={(v) => patch((d) => void (d.settings.hideReferenceContacts = v))}
            hint='Prints "on request" instead of their phone numbers.'
          />
          <Toggle
            label="Show declaration"
            checked={r.settings.showDeclaration}
            onChange={(v) => patch((d) => void (d.settings.showDeclaration = v))}
          />
          <Toggle
            label="Show signature line"
            checked={r.settings.showSignature}
            onChange={(v) => patch((d) => void (d.settings.showSignature = v))}
          />
        </div>
      </Accordion>

      {/* ------------------------------------------------ personal */}
      <Accordion title="Personal details" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Text
            label="Full name"
            placeholder={HINTS.fullName}
            value={r.basics.fullName}
            onChange={(v) => patch((d) => void (d.basics.fullName = v))}
          />
          <Text
            label="Job title"
            placeholder={HINTS.title}
            value={r.basics.title}
            onChange={(v) => patch((d) => void (d.basics.title = v))}
          />
          <Text
            label="Phone"
            placeholder={HINTS.phone}
            value={r.basics.phone}
            onChange={(v) => patch((d) => void (d.basics.phone = v))}
          />
          <Text
            label="Email"
            placeholder={HINTS.email}
            value={r.basics.email}
            onChange={(v) => patch((d) => void (d.basics.email = v))}
          />
          <Text
            label="Location"
            placeholder={HINTS.location}
            value={r.basics.location}
            onChange={(v) => patch((d) => void (d.basics.location = v))}
          />
          <Text
            label="Website"
            placeholder={HINTS.website}
            value={r.basics.website}
            onChange={(v) => patch((d) => void (d.basics.website = v))}
          />
        </div>

        <SectionColor r={r} patch={patch} id="contact" />

        <div className="flex items-center gap-3 pt-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0])}
          />
          <Button onClick={() => fileRef.current?.click()}>
            {r.basics.photo ? "Replace photo" : "Upload photo"}
          </Button>
          {r.basics.photo && (
            <Button variant="danger" onClick={() => patch((d) => void (d.basics.photo = ""))}>
              Remove photo
            </Button>
          )}
        </div>

        <TextArea
          label="Profile / summary"
          rows={6}
          placeholder={HINTS.summary}
          hint={`${r.basics.summary.trim().split(/\s+/).filter(Boolean).length} words`}
          value={r.basics.summary}
          onChange={(v) => patch((d) => void (d.basics.summary = v))}
        />

        <SectionColor r={r} patch={patch} id="profile" />
      </Accordion>

      {/* ------------------------------------------------ experience */}
      <Accordion title="Work experience" count={r.experience.length} defaultOpen>
        <Button
          variant="primary"
          onClick={() => {
            const id = uid();
            patch((d) =>
              d.experience.unshift({
                id,
                company: "",
                role: "",
                start: "",
                end: "",
                employment: "",
                bullets: [""],
              }),
            );
            reveal(id);
          }}
        >
          + Add role
        </Button>

        {r.experience.map((e, i) => (
          <div
            key={e.id}
            id={`item-${e.id}`}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{e.company || "New role"}</span>
              <ItemControls
                isFirst={i === 0}
                isLast={i === r.experience.length - 1}
                onUp={() => patch((d) => move(d.experience, i, i - 1))}
                onDown={() => patch((d) => move(d.experience, i, i + 1))}
                onRemove={() => patch((d) => void d.experience.splice(i, 1))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Text
                label="Company"
                placeholder={HINTS.company}
                value={e.company}
                onChange={(v) => patch((d) => void (d.experience[i].company = v))}
              />
              <Text
                label="Role"
                placeholder={HINTS.role}
                value={e.role}
                onChange={(v) => patch((d) => void (d.experience[i].role = v))}
              />
              <Text
                label="Start"
                placeholder={HINTS.start}
                value={e.start}
                onChange={(v) => patch((d) => void (d.experience[i].start = v))}
              />
              <Text
                label="End"
                placeholder={HINTS.end}
                value={e.end}
                onChange={(v) => patch((d) => void (d.experience[i].end = v))}
              />
              <div className="col-span-2">
                <Select
                  label="Employment type"
                  value={e.employment}
                  onChange={(v) => patch((d) => void (d.experience[i].employment = v as Experience["employment"]))}
                  options={EMPLOYMENT}
                />
              </div>
            </div>
            <div className="mt-2.5">
              <TextArea
                label="Bullets"
                hint="one per line"
                placeholder={HINTS.bullets}
                rows={Math.min(12, Math.max(4, e.bullets.length + 1))}
                value={e.bullets.join("\n")}
                onChange={(v) => patch((d) => void (d.experience[i].bullets = v.split("\n")))}
              />
            </div>
          </div>
        ))}

        <SectionColor r={r} patch={patch} id="experience" />
      </Accordion>

      {/* ------------------------------------------------ skills */}
      <Accordion title="Skills" count={r.skills.length}>
        <SkillsEditor r={r} patch={patch} />
        <SectionColor r={r} patch={patch} id="skills" />
      </Accordion>

      {/* ------------------------------------------------ education */}
      <Accordion title="Education" count={r.education.length}>
        <Button
          variant="primary"
          onClick={() => {
            const id = uid();
            patch((d) => d.education.unshift({ id, school: "", course: "", level: "", year: "" } as Education));
            reveal(id);
          }}
        >
          + Add education
        </Button>

        {r.education.map((e, i) => (
          <div
            key={e.id}
            id={`item-${e.id}`}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{e.school || "New entry"}</span>
              <ItemControls
                isFirst={i === 0}
                isLast={i === r.education.length - 1}
                onUp={() => patch((d) => move(d.education, i, i - 1))}
                onDown={() => patch((d) => move(d.education, i, i + 1))}
                onRemove={() => patch((d) => void d.education.splice(i, 1))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Text
                label="School"
                placeholder={HINTS.school}
                value={e.school}
                onChange={(v) => patch((d) => void (d.education[i].school = v))}
              />
              <Text
                label="Course"
                placeholder={HINTS.course}
                value={e.course}
                onChange={(v) => patch((d) => void (d.education[i].course = v))}
              />
              <Text
                label="Level"
                placeholder={HINTS.level}
                value={e.level}
                onChange={(v) => patch((d) => void (d.education[i].level = v))}
              />
              <Text
                label="Year"
                placeholder={HINTS.year}
                value={e.year}
                onChange={(v) => patch((d) => void (d.education[i].year = v))}
              />
            </div>
          </div>
        ))}

        <SectionColor r={r} patch={patch} id="education" />
      </Accordion>

      {/* ------------------------------------------------ languages */}
      <Accordion title="Languages" count={r.languages.length}>
        <Button
          variant="primary"
          onClick={() => {
            const id = uid();
            patch((d) => d.languages.unshift({ id, name: "", level: "" } as Language));
            reveal(id);
          }}
        >
          + Add language
        </Button>

        {r.languages.map((l, i) => (
          <div key={l.id} id={`item-${l.id}`} className="flex items-end gap-2">
            <div className="grid flex-1 grid-cols-2 gap-2.5">
              <Text
                label="Language"
                placeholder={HINTS.language}
                value={l.name}
                onChange={(v) => patch((d) => void (d.languages[i].name = v))}
              />
              <Text
                label="Level"
                placeholder={HINTS.languageLevel}
                value={l.level}
                onChange={(v) => patch((d) => void (d.languages[i].level = v))}
              />
            </div>
            <ItemControls
              isFirst={i === 0}
              isLast={i === r.languages.length - 1}
              onUp={() => patch((d) => move(d.languages, i, i - 1))}
              onDown={() => patch((d) => move(d.languages, i, i + 1))}
              onRemove={() => patch((d) => void d.languages.splice(i, 1))}
            />
          </div>
        ))}

        <SectionColor r={r} patch={patch} id="languages" />
      </Accordion>

      {/* ------------------------------------------------ references */}
      <Accordion title="References" count={r.references.length}>
        <Button
          variant="primary"
          onClick={() => {
            const id = uid();
            patch((d) =>
              d.references.unshift({ id, name: "", role: "", company: "", phone: "", email: "" } as Reference),
            );
            reveal(id);
          }}
        >
          + Add reference
        </Button>

        {r.references.map((x, i) => (
          <div
            key={x.id}
            id={`item-${x.id}`}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{x.name || "New reference"}</span>
              <ItemControls
                isFirst={i === 0}
                isLast={i === r.references.length - 1}
                onUp={() => patch((d) => move(d.references, i, i - 1))}
                onDown={() => patch((d) => move(d.references, i, i + 1))}
                onRemove={() => patch((d) => void d.references.splice(i, 1))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Text
                label="Name"
                placeholder={HINTS.refName}
                value={x.name}
                onChange={(v) => patch((d) => void (d.references[i].name = v))}
              />
              <Text
                label="Role"
                placeholder={HINTS.refRole}
                value={x.role}
                onChange={(v) => patch((d) => void (d.references[i].role = v))}
              />
              <Text
                label="Company"
                placeholder={HINTS.refCompany}
                value={x.company}
                onChange={(v) => patch((d) => void (d.references[i].company = v))}
              />
              <Text
                label="Phone"
                placeholder={HINTS.refPhone}
                value={x.phone}
                onChange={(v) => patch((d) => void (d.references[i].phone = v))}
              />
              <div className="col-span-2">
                <Text
                  label="Email"
                  placeholder={HINTS.refEmail}
                  value={x.email}
                  onChange={(v) => patch((d) => void (d.references[i].email = v))}
                />
              </div>
            </div>
          </div>
        ))}

        <SectionColor r={r} patch={patch} id="references" />
      </Accordion>

      {/* ------------------------------------------------ declaration */}
      <Accordion title="Declaration">
        <TextArea
          label="Declaration text"
          rows={4}
          value={r.declaration}
          onChange={(v) => patch((d) => void (d.declaration = v))}
        />
      </Accordion>
    </div>
  );
}
