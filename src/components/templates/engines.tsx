import type { ReactNode } from "react";
import type { Resume } from "@/lib/types";
import type { TemplateSpec, Tokens } from "@/lib/templates/types";
import {
  Contact,
  Declaration,
  Education,
  Experience,
  Languages,
  Name,
  Photo,
  References,
  Section,
  SideSections,
  Skills,
  SkillsGrid,
  Summary,
  docStyle,
  sectionGap,
} from "./primitives";
import {
  EditorialEngine,
  MemphisEngine,
  ModularEngine,
  SplitEngine,
  WaveEngine,
} from "./engines-extra";

type EngineProps = { r: Resume; t: Tokens; spec: TemplateSpec };

/** Body sections shared by every single-column engine. */
function MainSections({
  r,
  t,
  timeline = false,
}: {
  r: Resume;
  t: Tokens;
  timeline?: boolean;
}) {
  let n = 0;
  return (
    <>
      {r.basics.summary && (
        <Section t={t} title="Profile" index={++n}>
          <Summary r={r} t={t} />
        </Section>
      )}
      {r.skills.length > 0 && (
        <Section t={t} title="Skills" index={++n}>
          <SkillsGrid r={r} t={t} />
        </Section>
      )}
      {r.experience.length > 0 && (
        <Section t={t} title="Work Experience" index={++n}>
          <Experience r={r} t={t} variant={timeline ? "timeline" : "plain"} />
        </Section>
      )}
      {r.education.length > 0 && (
        <Section t={t} title="Education" index={++n}>
          <Education r={r} t={t} layout="rows" />
        </Section>
      )}
      {r.languages.length > 0 && (
        <Section t={t} title="Languages" index={++n}>
          <Languages r={r} t={t} layout="inline" />
        </Section>
      )}
      {r.settings.showReferences && r.references.length > 0 && (
        <Section t={t} title="References" index={++n}>
          <References r={r} t={t} />
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** Tinted column beside the main content. Two columns: looks good, parses worse. */
export function SidebarEngine({ r, t, spec }: EngineProps) {
  const right = spec.side === "right";
  const aside = (
    <aside
      className="shrink-0"
      style={{ width: `${t.sidebarWidth}%`, backgroundColor: t.surface, padding: "2em 1.6em" }}
    >
      {t.photo !== "none" && r.settings.showPhoto && (
        <div className="mb-[1.6em] flex justify-center">
          <Photo r={r} t={t} />
        </div>
      )}
      <SideSections r={r} t={t} />
    </aside>
  );
  // The sidebar renders first, so the main column picks up where it left off.
  const sideCount =
    1 +
    (r.skills.length > 0 ? 1 : 0) +
    (r.languages.length > 0 ? 1 : 0) +
    (r.education.length > 0 ? 1 : 0) +
    (r.settings.showReferences && r.references.length > 0 ? 1 : 0);

  return (
    <div style={docStyle(t)}>
      <header style={{ backgroundColor: t.accent, padding: "1.8em 2em" }}>
        <Name r={r} t={t} align={right ? "left" : "right"} onAccent />
      </header>
      <div className="flex">
        {!right && aside}
        <main className="flex-1" style={{ padding: "2em 1.8em" }}>
          {r.basics.summary && (
            <Section t={t} title="Profile" index={sideCount + 1}>
              <Summary r={r} t={t} />
            </Section>
          )}
          {r.experience.length > 0 && (
            <Section t={t} title="Work Experience" index={sideCount + 2}>
              <Experience r={r} t={t} />
            </Section>
          )}
          <Declaration r={r} t={t} />
        </main>
        {right && aside}
      </div>
    </div>
  );
}

/** Full-width accent header, one column beneath. */
export function BannerEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div style={docStyle(t)}>
      <header
        className="flex items-center gap-[1.5em]"
        style={{ backgroundColor: t.accent, padding: "2em 2.4em" }}
      >
        {showPhoto && <Photo r={r} t={t} size="7.5em" />}
        <div className="flex-1">
          <Name r={r} t={t} onAccent />
          <div className="mt-[0.8em]" style={{ color: t.onAccent, opacity: 0.9 }}>
            <Contact r={r} t={t} layout="inline" />
          </div>
        </div>
      </header>
      <main style={{ padding: "2em 2.4em" }}>
        <MainSections r={r} t={t} />
        <Declaration r={r} t={t} />
      </main>
    </div>
  );
}

/** Plain single column. No colour blocks, nothing for a parser to trip over. */
export function StackEngine({ r, t }: EngineProps) {
  return (
    <div style={{ ...docStyle(t), padding: "2.4em 2.6em" }}>
      <header style={{ marginBottom: sectionGap(t) }}>
        <Name r={r} t={t} />
        <div className="mt-[0.6em]">
          <Contact r={r} t={t} layout="inline" />
        </div>
      </header>
      <MainSections r={r} t={t} />
      <Declaration r={r} t={t} />
    </div>
  );
}

/** Centred name over a rule, single column below. */
export function CenteredEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div style={{ ...docStyle(t), padding: "2.4em 2.8em" }}>
      <header
        className="flex flex-col items-center text-center"
        style={{ marginBottom: sectionGap(t), paddingBottom: "1em", borderBottom: `2px solid ${t.accent}` }}
      >
        {showPhoto && (
          <div className="mb-[1em]">
            <Photo r={r} t={t} size="7.5em" />
          </div>
        )}
        <Name r={r} t={t} align="center" />
        <div className="mt-[0.7em]">
          <Contact r={r} t={t} layout="inline" />
        </div>
      </header>
      <MainSections r={r} t={t} />
      <Declaration r={r} t={t} />
    </div>
  );
}

/** Single column with a rail running down the experience list. */
export function TimelineEngine({ r, t }: EngineProps) {
  return (
    <div style={{ ...docStyle(t), padding: "2.4em 2.6em" }}>
      <header
        style={{ marginBottom: sectionGap(t), borderLeft: `4px solid ${t.accent}`, paddingLeft: "1em" }}
      >
        <Name r={r} t={t} />
        <div className="mt-[0.6em]">
          <Contact r={r} t={t} layout="inline" />
        </div>
      </header>
      <MainSections r={r} t={t} timeline />
      <Declaration r={r} t={t} />
    </div>
  );
}

/** Each section boxed. Skims very fast. */
function Card({ t, children }: { t: Tokens; children: ReactNode }) {
  return (
    <div
      className="avoid-break"
      style={{
        border: `1px solid ${t.line}`,
        backgroundColor: t.surface,
        borderRadius: "0.5em",
        padding: "1.1em 1.3em",
        marginBottom: sectionGap(t),
      }}
    >
      {children}
    </div>
  );
}

export function CardsEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;

  return (
    <div style={{ ...docStyle(t), padding: "2em 2.2em" }}>
      <header className="flex items-center gap-[1.2em]" style={{ marginBottom: sectionGap(t) }}>
        {showPhoto && <Photo r={r} t={t} size="6.5em" />}
        <div className="flex-1">
          <Name r={r} t={t} />
          <div className="mt-[0.6em]">
            <Contact r={r} t={t} layout="inline" />
          </div>
        </div>
      </header>

      {r.basics.summary && (
        <Card t={t}>
          <Section t={t} title="Profile">
            <Summary r={r} t={t} />
          </Section>
        </Card>
      )}
      {r.skills.length > 0 && (
        <Card t={t}>
          <Section t={t} title="Skills">
            <SkillsGrid r={r} t={t} />
          </Section>
        </Card>
      )}
      {r.experience.length > 0 && (
        <Card t={t}>
          <Section t={t} title="Work Experience">
            <Experience r={r} t={t} />
          </Section>
        </Card>
      )}
      {r.education.length > 0 && (
        <Card t={t}>
          <Section t={t} title="Education">
            <Education r={r} t={t} layout="rows" />
          </Section>
        </Card>
      )}
      {(r.languages.length > 0 || (r.settings.showReferences && r.references.length > 0)) && (
        <Card t={t}>
          <div className="grid grid-cols-2 gap-[1.5em]">
            {r.languages.length > 0 && (
              <Section t={t} title="Languages">
                <Languages r={r} t={t} />
              </Section>
            )}
            {r.settings.showReferences && r.references.length > 0 && (
              <Section t={t} title="References">
                <References r={r} t={t} />
              </Section>
            )}
          </div>
        </Card>
      )}
      <Declaration r={r} t={t} />
    </div>
  );
}

/** A thin accent strip down one edge — colour without a colour block. */
export function EdgeEngine({ r, t, spec }: EngineProps) {
  const right = spec.side === "right";
  const strip = <div className="shrink-0" style={{ width: "0.9em", backgroundColor: t.accent }} />;
  return (
    <div className="flex" style={docStyle(t)}>
      {!right && strip}
      <div className="flex-1" style={{ padding: "2.4em 2.4em" }}>
        <header style={{ marginBottom: sectionGap(t) }}>
          <Name r={r} t={t} align={right ? "right" : "left"} />
          <div className="mt-[0.6em]" style={{ textAlign: right ? "right" : "left" }}>
            <Contact r={r} t={t} layout="inline" />
          </div>
        </header>
        <MainSections r={r} t={t} />
        <Declaration r={r} t={t} />
      </div>
      {right && strip}
    </div>
  );
}

/** Experience full width, short sections packed into a grid to save a page. */
export function CompactEngine({ r, t }: EngineProps) {
  const showPhoto = t.photo !== "none" && r.settings.showPhoto;
  return (
    <div style={{ ...docStyle(t), padding: "2.2em 2.4em" }}>
      <header className="flex items-center gap-[1.2em]" style={{ marginBottom: sectionGap(t) }}>
        {showPhoto && <Photo r={r} t={t} size="6.5em" />}
        <div className="flex-1">
          <Name r={r} t={t} />
          <div className="mt-[0.6em]">
            <Contact r={r} t={t} layout="inline" />
          </div>
        </div>
      </header>

      {r.basics.summary && (
        <Section t={t} title="Profile">
          <Summary r={r} t={t} />
        </Section>
      )}
      {r.experience.length > 0 && (
        <Section t={t} title="Work Experience">
          <Experience r={r} t={t} />
        </Section>
      )}

      <div className="grid grid-cols-2 gap-x-[1.8em]">
        {r.skills.length > 0 && (
          <Section t={t} title="Skills">
            <Skills r={r} t={t} />
          </Section>
        )}
        {r.education.length > 0 && (
          <Section t={t} title="Education">
            <Education r={r} t={t} />
          </Section>
        )}
        {r.languages.length > 0 && (
          <Section t={t} title="Languages">
            <Languages r={r} t={t} />
          </Section>
        )}
        {r.settings.showReferences && r.references.length > 0 && (
          <Section t={t} title="References">
            <References r={r} t={t} />
          </Section>
        )}
      </div>

      <Declaration r={r} t={t} />
    </div>
  );
}

export const ENGINES = {
  sidebar: SidebarEngine,
  banner: BannerEngine,
  stack: StackEngine,
  centered: CenteredEngine,
  timeline: TimelineEngine,
  cards: CardsEngine,
  edge: EdgeEngine,
  compact: CompactEngine,
  wave: WaveEngine,
  modular: ModularEngine,
  editorial: EditorialEngine,
  memphis: MemphisEngine,
  split: SplitEngine,
} as const;
