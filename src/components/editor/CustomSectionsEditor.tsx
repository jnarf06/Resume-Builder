"use client";

import type { CustomEntry, CustomSection, Resume } from "@/lib/types";
import { CUSTOM_LAYOUTS, uid } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import { Button, ItemControls, Select, Text, TextArea } from "./Fields";
import ColorField from "./ColorField";

type Patch = (fn: (draft: Resume) => void) => void;

function move<T>(arr: T[], from: number, to: number) {
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
}

function reveal(id: string) {
  setTimeout(() => {
    document.getElementById(`item-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, 0);
}

/** Titles people actually add, offered as one-click starters. */
const PRESETS = [
  "Certifications",
  "Seminars & Trainings",
  "Eligibility",
  "Awards & Recognition",
  "Projects",
  "Volunteer Work",
  "Affiliations",
  "Publications",
];

function blank(title = ""): CustomSection {
  return {
    id: uid(),
    title,
    layout: "bullets",
    bullets: [""],
    text: "",
    entries: [],
    placement: "main",
    color: "",
  };
}

export default function CustomSectionsEditor({ r, patch }: { r: Resume; patch: Patch }) {
  const spec = getTemplate(r.settings.template);
  const twoColumn = !spec.atsSafe && spec.engine === "sidebar";
  const accent = r.settings.colors?.accent || r.settings.accent || spec.tokens.accent;

  function add(title = "") {
    const section = blank(title);
    patch((d) => d.custom.push(section));
    reveal(section.id);
  }

  return (
    <div className="space-y-3">
      <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        Anything the built-in sections do not cover. Sections appear on the page in the order below,
        after your references.
      </p>

      <div>
        <span className="mb-1.5 block text-xs font-medium text-slate-600">Add a section</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => add(title)}
              className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-slate-500 hover:bg-slate-50"
            >
              + {title}
            </button>
          ))}
          <Button variant="primary" onClick={() => add()}>
            + Blank section
          </Button>
        </div>
      </div>

      {r.custom.map((c, i) => (
        <div
          key={c.id}
          id={`item-${c.id}`}
          className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{c.title || "Untitled section"}</span>
            <ItemControls
              isFirst={i === 0}
              isLast={i === r.custom.length - 1}
              onUp={() => patch((d) => move(d.custom, i, i - 1))}
              onDown={() => patch((d) => move(d.custom, i, i + 1))}
              onRemove={() => patch((d) => void d.custom.splice(i, 1))}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <Text
                label="Section title"
                placeholder="Certifications"
                value={c.title}
                onChange={(v) => patch((d) => void (d.custom[i].title = v))}
              />
            </div>
            <Select
              label="Layout"
              value={c.layout}
              onChange={(v) => patch((d) => void (d.custom[i].layout = v as CustomSection["layout"]))}
              options={CUSTOM_LAYOUTS.map((l) => ({ value: l.value, label: l.label }))}
            />
            <Select
              label="Column"
              value={c.placement}
              onChange={(v) => patch((d) => void (d.custom[i].placement = v as CustomSection["placement"]))}
              options={[
                { value: "main", label: "Main column" },
                { value: "side", label: "Sidebar" },
              ]}
            />
          </div>

          <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
            {CUSTOM_LAYOUTS.find((l) => l.value === c.layout)?.hint}
            {!twoColumn && c.placement === "side" && (
              <>
                {" · "}
                <span className="text-amber-600">
                  “{spec.name}” has no sidebar, so this prints in the main column.
                </span>
              </>
            )}
          </p>

          <div className="mt-2.5">
            {c.layout === "bullets" && (
              <TextArea
                label="Items"
                hint="one per line"
                rows={Math.min(10, Math.max(3, c.bullets.length + 1))}
                placeholder={"Google Ads Search Certification — 2024\nCivil Service Eligibility (Professional)"}
                value={c.bullets.join("\n")}
                onChange={(v) => patch((d) => void (d.custom[i].bullets = v.split("\n")))}
              />
            )}

            {c.layout === "text" && (
              <TextArea
                label="Text"
                rows={4}
                placeholder="A short paragraph."
                value={c.text}
                onChange={(v) => patch((d) => void (d.custom[i].text = v))}
              />
            )}

            {c.layout === "entries" && (
              <EntriesEditor
                entries={c.entries}
                onChange={(fn) => patch((d) => fn(d.custom[i].entries))}
              />
            )}
          </div>

          <div className="mt-2.5">
            <ColorField
              compact
              label={`${c.title || "Section"} heading`}
              hint={c.color ? "Custom colour" : "Following the document accent"}
              value={c.color || accent}
              isCustom={Boolean(c.color)}
              onChange={(hex) => patch((d) => void (d.custom[i].color = hex))}
              onReset={() => patch((d) => void (d.custom[i].color = ""))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EntriesEditor({
  entries,
  onChange,
}: {
  entries: CustomEntry[];
  onChange: (fn: (list: CustomEntry[]) => void) => void;
}) {
  return (
    <div className="space-y-2">
      <Button
        variant="primary"
        onClick={() =>
          onChange((list) =>
            list.unshift({ id: uid(), title: "", subtitle: "", date: "", detail: "" }),
          )
        }
      >
        + Add entry
      </Button>

      {entries.map((e, j) => (
        <div key={e.id} className="rounded-md border border-slate-200 bg-white p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">{e.title || "New entry"}</span>
            <ItemControls
              isFirst={j === 0}
              isLast={j === entries.length - 1}
              onUp={() => onChange((list) => move(list, j, j - 1))}
              onDown={() => onChange((list) => move(list, j, j + 1))}
              onRemove={() => onChange((list) => void list.splice(j, 1))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Text
              label="Title"
              placeholder="Performance Marketing Summit"
              value={e.title}
              onChange={(v) => onChange((list) => void (list[j].title = v))}
            />
            <Text
              label="Date"
              placeholder="2024"
              value={e.date}
              onChange={(v) => onChange((list) => void (list[j].date = v))}
            />
            <div className="col-span-2">
              <Text
                label="Organisation"
                placeholder="Philippine Marketing Association"
                value={e.subtitle}
                onChange={(v) => onChange((list) => void (list[j].subtitle = v))}
              />
            </div>
            <div className="col-span-2">
              <TextArea
                label="Detail"
                rows={2}
                placeholder="Optional — one line on what it covered."
                value={e.detail}
                onChange={(v) => onChange((list) => void (list[j].detail = v))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
