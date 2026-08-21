import type { Resume } from "@/lib/types";
import type { TemplateSpec, Tokens } from "@/lib/templates/types";
import {
  Contact,
  CustomSections,
  Declaration,
  Decoration,
  Education,
  Experience,
  Languages,
  Name,
  Photo,
  References,
  Section,
  SideSections,
  Skills,
  Summary,
  docStyle,
  sectionGap,
  tint,
} from "./primitives";

type EngineProps = { r: Resume; t: Tokens; spec: TemplateSpec };

/**
 * The shape-led engines. Where the eight in engines.tsx vary a conventional
 * page, these each commit to one strong device: a curve, a block grid, a
 * magazine setting, geometric furniture, or a colour field the photo straddles.
 * All are two-column or decorated, so none of them are ATS-safe.
 */

/** Colour field across the top, closed off by a curve. Photo sits in the field. */
export function WaveEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div className="relative" style={docStyle(t)}>
      <header className="relative" style={{ backgroundColor: t.accent, padding: "2.2em 2.4em 3.6em" }}>
        <div className="flex items-center gap-[1.5em]">
          <div className="flex-1">
            <Name r={r} t={t} onAccent />
          </div>
          {showPhoto && <Photo r={r} t={t} size="8em" />}
        </div>
        <svg
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "3.2em", display: "block" }}
        >
          <path d="M0 8 Q 30 0 60 3.5 T 100 1.5 L 100 8 Z" fill={t.pageBg} />
        </svg>
      </header>

      <div className="flex" style={{ padding: "0.4em 2.2em 2.2em" }}>
        <aside className="shrink-0" style={{ width: `${t.sidebarWidth}%`, paddingRight: "1.6em" }}>
          <SideSections r={r} t={t} />
        </aside>
        <main className="flex-1">
          {r.basics.summary && (
            <Section r={r} id="profile" t={t} title="About Me" index={1}>
              <Summary r={r} t={t} />
            </Section>
          )}
          {r.experience.length > 0 && (
            <Section r={r} id="experience" t={t} title="Experience" index={2}>
              <Experience r={r} t={t} />
            </Section>
          )}
          <CustomSections r={r} t={t} placement="main" from={3} />
          <Declaration r={r} t={t} />
        </main>
      </div>
    </div>
  );
}

/** Everything in filled blocks on a grid. Reads like a dashboard. */
export function ModularEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  const block = (filled: boolean) => ({
    backgroundColor: filled ? t.accent : t.surface,
    color: filled ? t.onAccent : t.ink,
    padding: "1.1em 1.3em",
    marginBottom: "0.9em",
  });

  return (
    <div style={{ ...docStyle(t), padding: "1.6em" }}>
      <header className="flex items-center gap-[1.4em]" style={block(true)}>
        {showPhoto && <Photo r={r} t={t} size="7em" />}
        <div className="flex-1">
          <Name r={r} t={t} onAccent />
          <div className="mt-[0.7em]" style={{ color: t.onAccent, opacity: 0.9 }}>
            <Contact r={r} t={t} layout="inline" />
          </div>
        </div>
      </header>

      {r.basics.summary && (
        <div style={block(false)}>
          <Section r={r} id="profile" t={t} title="About Me" index={1}>
            <Summary r={r} t={t} />
          </Section>
        </div>
      )}

      <div className="grid grid-cols-2 gap-[0.9em]">
        {r.education.length > 0 && (
          <div className="avoid-break" style={block(false)}>
            <Section r={r} id="education" t={t} title="Education" index={2}>
              <Education r={r} t={t} />
            </Section>
          </div>
        )}
        {r.skills.length > 0 && (
          <div className="avoid-break" style={block(false)}>
            <Section r={r} id="skills" t={t} title="Skills" index={3}>
              <Skills r={r} t={t} />
            </Section>
          </div>
        )}
      </div>

      {r.experience.length > 0 && (
        <div style={block(false)}>
          <Section r={r} id="experience" t={t} title="Experience" index={4}>
            <Experience r={r} t={t} />
          </Section>
        </div>
      )}

      <div className="grid grid-cols-2 gap-[0.9em]">
        {r.languages.length > 0 && (
          <div className="avoid-break" style={block(false)}>
            <Section r={r} id="languages" t={t} title="Languages" index={5}>
              <Languages r={r} t={t} />
            </Section>
          </div>
        )}
        {r.settings.showReferences && r.references.length > 0 && (
          <div className="avoid-break" style={block(false)}>
            <Section r={r} id="references" t={t} title="References" index={6}>
              <References r={r} t={t} />
            </Section>
          </div>
        )}
      </div>

      {r.custom.length > 0 && (
        <div style={block(false)}>
          <CustomSections r={r} t={t} placement="all" from={7} />
        </div>
      )}

      <Declaration r={r} t={t} />
    </div>
  );
}

/** Magazine setting: oversized two-tone name, rules, two-column body. */
export function EditorialEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div style={{ ...docStyle(t), padding: "2.6em 2.8em" }}>
      <header style={{ borderTop: `2px solid ${t.ink}`, borderBottom: `1px solid ${t.ink}`, padding: "0.7em 0" }}>
        <Name r={r} t={t} align="center" />
      </header>
      <div
        className="flex items-center justify-center"
        style={{ borderBottom: `1px solid ${t.ink}`, padding: "0.6em 0", marginBottom: sectionGap(t) }}
      >
        <Contact r={r} t={t} layout="inline" />
      </div>

      <div className="flex gap-[1.8em]">
        <main className="flex-1">
          {r.basics.summary && (
            <Section r={r} id="profile" t={t} title="Profile" index={1}>
              <Summary r={r} t={t} />
            </Section>
          )}
          {r.experience.length > 0 && (
            <Section r={r} id="experience" t={t} title="Work Experience" index={2}>
              <Experience r={r} t={t} />
            </Section>
          )}
          <CustomSections r={r} t={t} placement="main" from={7} />
        </main>
        <aside className="shrink-0" style={{ width: `${t.sidebarWidth}%` }}>
          {showPhoto && (
            <div className="mb-[1.4em]">
              <Photo r={r} t={t} size="100%" />
            </div>
          )}
          {r.education.length > 0 && (
            <Section r={r} id="education" t={t} title="Education" index={3}>
              <Education r={r} t={t} />
            </Section>
          )}
          {r.skills.length > 0 && (
            <Section r={r} id="skills" t={t} title="Key Skills" index={4}>
              <Skills r={r} t={t} />
            </Section>
          )}
          {r.languages.length > 0 && (
            <Section r={r} id="languages" t={t} title="Languages" index={5}>
              <Languages r={r} t={t} />
            </Section>
          )}
          {r.settings.showReferences && r.references.length > 0 && (
            <Section r={r} id="references" t={t} title="References" index={6}>
              <References r={r} t={t} />
            </Section>
          )}
          <CustomSections r={r} t={t} placement="side" from={9} />
        </aside>
      </div>
      <Declaration r={r} t={t} />
    </div>
  );
}

/** Geometric furniture around an offset photo frame, then a two-up body. */
export function MemphisEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div className="relative overflow-hidden" style={{ ...docStyle(t), padding: "2.2em 2.4em" }}>
      <Decoration t={t} />

      <header className="relative" style={{ marginBottom: sectionGap(t) }}>
        <div
          className="inline-block"
          style={{ backgroundColor: tint(t.accent, 0.22), padding: "0.35em 0.9em", marginBottom: "0.8em" }}
        >
          <Name r={r} t={t} />
        </div>
        {showPhoto && (
          <div className="relative mt-[0.6em] flex justify-center">
            <span
              aria-hidden
              className="absolute"
              style={{
                top: "-0.7em",
                left: "50%",
                marginLeft: "-5.4em",
                width: "10.8em",
                height: "10.8em",
                backgroundColor: tint(t.accent, 0.3),
              }}
            />
            <span className="relative">
              <Photo r={r} t={t} size="10em" />
            </span>
          </div>
        )}
        <div className="mt-[1em]">
          <Contact r={r} t={t} layout="inline" />
        </div>
      </header>

      <div className="relative grid grid-cols-2 gap-x-[2em]">
        {r.basics.summary && (
          <div className="col-span-2">
            <Section r={r} id="profile" t={t} title="About Me" index={1}>
              <Summary r={r} t={t} />
            </Section>
          </div>
        )}
        {r.experience.length > 0 && (
          <div className="col-span-2">
            <Section r={r} id="experience" t={t} title="Work Experience" index={2}>
              <Experience r={r} t={t} />
            </Section>
          </div>
        )}
        {r.skills.length > 0 && (
          <Section r={r} id="skills" t={t} title="Expertise" index={3}>
            <Skills r={r} t={t} />
          </Section>
        )}
        {r.education.length > 0 && (
          <Section r={r} id="education" t={t} title="Education" index={4}>
            <Education r={r} t={t} />
          </Section>
        )}
        {r.languages.length > 0 && (
          <Section r={r} id="languages" t={t} title="Language" index={5}>
            <Languages r={r} t={t} />
          </Section>
        )}
        {r.settings.showReferences && r.references.length > 0 && (
          <Section r={r} id="references" t={t} title="References" index={6}>
            <References r={r} t={t} />
          </Section>
        )}
        <CustomSections r={r} t={t} placement="all" from={7} />
      </div>
      <Declaration r={r} t={t} />
    </div>
  );
}

/**
 * Pale header, big colour field below, portrait straddling the boundary.
 * Inside the field the accent *is* the background, so the tokens are swapped:
 * headings and rules switch to the on-accent colour or nothing would be legible.
 */
export function SplitEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  const onField: Tokens = {
    ...t,
    accent: t.onAccent,
    ink: t.onAccent,
    muted: tint(t.onAccent, 0.75),
    line: tint(t.onAccent, 0.35),
  };

  return (
    <div style={docStyle(t)}>
      <header className="flex items-center gap-[1.5em]" style={{ padding: "2.2em 2.4em 1.4em" }}>
        <div className="flex-1">
          <Name r={r} t={t} />
          <div className="mt-[0.7em]">
            <Contact r={r} t={t} layout="inline" />
          </div>
        </div>
        {showPhoto && (
          <div style={{ marginBottom: "-3.5em", position: "relative", zIndex: 1 }}>
            <Photo r={r} t={t} size="9.5em" />
          </div>
        )}
      </header>

      <div
        style={{
          backgroundColor: t.accent,
          color: t.onAccent,
          padding: "2.6em 2.4em 2.2em",
          borderTopLeftRadius: "2.5em",
        }}
      >
        <div className="grid grid-cols-2 gap-x-[2em]">
          {r.basics.summary && (
            <div className="col-span-2">
              <Section r={r} id="profile" t={onField} title="About Me" index={1}>
                <Summary r={r} t={onField} />
              </Section>
            </div>
          )}
          {r.experience.length > 0 && (
            <div className="col-span-2">
              <Section r={r} id="experience" t={onField} title="Experience" index={2}>
                <Experience r={r} t={onField} />
              </Section>
            </div>
          )}
          {r.education.length > 0 && (
            <Section r={r} id="education" t={onField} title="Education" index={3}>
              <Education r={r} t={onField} />
            </Section>
          )}
          {r.skills.length > 0 && (
            <Section r={r} id="skills" t={onField} title="Skills" index={4}>
              <Skills r={r} t={onField} />
            </Section>
          )}
          {r.languages.length > 0 && (
            <Section r={r} id="languages" t={onField} title="Languages" index={5}>
              <Languages r={r} t={onField} />
            </Section>
          )}
          {r.settings.showReferences && r.references.length > 0 && (
            <Section r={r} id="references" t={onField} title="References" index={6}>
              <References r={r} t={onField} />
            </Section>
          )}
          <CustomSections r={r} t={onField} placement="all" from={7} />
        </div>
        <Declaration r={r} t={onField} />
      </div>
    </div>
  );
}
