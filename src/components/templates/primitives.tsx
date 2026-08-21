import type { CSSProperties, ReactNode } from "react";
import type { Resume, SectionId, Skill } from "@/lib/types";
import { FONT_STACKS, GLYPH, SPACING, type Tokens } from "@/lib/templates/types";

export type Ctx = { r: Resume; t: Tokens };

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Root style for a document: font stack, ink colour and the density line-height. */
export function docStyle(t: Tokens): CSSProperties {
  return {
    fontFamily: FONT_STACKS[t.font],
    color: t.ink,
    backgroundColor: t.pageBg,
    lineHeight: SPACING[t.density].line,
  };
}

export const sectionGap = (t: Tokens) => `${SPACING[t.density].section}em`;
export const itemGap = (t: Tokens) => `${SPACING[t.density].item}em`;

/** Translucent accent, for tints that work on light and dark grounds alike. */
export const tint = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** Words people actually write in the language Level field, as a proportion. */
const WORD_LEVELS: Record<string, number> = {
  native: 1,
  fluent: 0.95,
  bilingual: 0.95,
  advanced: 0.85,
  proficient: 0.8,
  conversational: 0.6,
  intermediate: 0.6,
  basic: 0.35,
  beginner: 0.25,
};

export function wordLevel(value: string): number | null {
  const key = value.trim().toLowerCase();
  if (WORD_LEVELS[key] !== undefined) return WORD_LEVELS[key];
  // Also accept a bare number, so "4" or "80" in the Level field still works.
  const n = Number(key.replace("%", ""));
  if (!key || Number.isNaN(n)) return null;
  return Math.max(0, Math.min(1, n > 5 ? n / 100 : n / 5));
}

/* -------------------------------------------------------------------------- */
/* meters                                                                     */
/* -------------------------------------------------------------------------- */

export function Meter({ t, value }: { t: Tokens; value: number }) {
  if (t.meter === "none") return null;

  if (t.meter === "bar") {
    return (
      <span
        className="ml-[0.8em] inline-block shrink-0 overflow-hidden align-middle"
        style={{ width: "6em", height: "0.5em", backgroundColor: tint(t.accent, t.dark ? 0.25 : 0.18) }}
      >
        <span className="block h-full" style={{ width: `${value * 100}%`, backgroundColor: t.accent }} />
      </span>
    );
  }

  const filled = Math.round(value * 5);
  if (t.meter === "dots") {
    return (
      <span className="ml-[0.8em] inline-flex shrink-0 gap-[0.2em] align-middle">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            style={{
              width: "0.45em",
              height: "0.45em",
              borderRadius: "9999px",
              backgroundColor: i < filled ? t.accent : tint(t.accent, t.dark ? 0.28 : 0.2),
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className="ml-[0.8em] shrink-0 align-middle"
      style={{ color: t.accent, letterSpacing: "0.05em", fontSize: "0.9em" }}
    >
      {"★".repeat(filled)}
      <span style={{ opacity: 0.3 }}>{"★".repeat(5 - filled)}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* headings                                                                   */
/* -------------------------------------------------------------------------- */

export function SectionHead({ t, index, children }: { t: Tokens; index?: number; children: ReactNode }) {
  const label: CSSProperties = {
    fontFamily: FONT_STACKS[t.headingFont],
    letterSpacing: `${t.headingTracking}em`,
    textTransform: t.headingUpper ? "uppercase" : "none",
    fontWeight: 700,
    fontSize: "1.08em",
    color: t.accent,
  };

  switch (t.headingStyle) {
    case "boxed":
      return (
        <h2
          className="mb-[0.5em] inline-block"
          style={{ ...label, color: t.onAccent, backgroundColor: t.accent, padding: "0.18em 0.6em" }}
        >
          {children}
        </h2>
      );

    case "chip":
      return (
        <h2
          className="mb-[0.5em] inline-block"
          style={{
            ...label,
            backgroundColor: tint(t.accent, t.dark ? 0.25 : 0.14),
            padding: "0.22em 0.9em",
            borderRadius: "9999px",
          }}
        >
          {children}
        </h2>
      );

    case "highlight":
      return (
        <h2 className="mb-[0.5em]">
          <span
            style={{
              ...label,
              color: t.ink,
              backgroundColor: tint(t.accent, t.dark ? 0.35 : 0.3),
              padding: "0.1em 0.55em",
              boxDecorationBreak: "clone",
            }}
          >
            {children}
          </span>
        </h2>
      );

    case "numbered":
      return (
        <h2 className="mb-[0.5em] flex items-center gap-[0.6em]">
          {index !== undefined && (
            <span
              className="flex shrink-0 items-center justify-center"
              style={{
                width: "1.7em",
                height: "1.7em",
                borderRadius: "9999px",
                backgroundColor: t.accent,
                color: t.onAccent,
                fontSize: "0.85em",
                fontWeight: 700,
              }}
            >
              {index}
            </span>
          )}
          <span style={label}>{children}</span>
        </h2>
      );

    case "leader":
      return (
        <h2 className="mb-[0.5em] flex items-baseline gap-[0.5em]">
          <span style={label}>{children}</span>
          <span
            className="flex-1"
            style={{
              borderBottom: `2px dotted ${tint(t.accent, 0.6)}`,
              transform: "translateY(-0.25em)",
            }}
          />
        </h2>
      );

    case "bar":
      return (
        <h2 className="mb-[0.5em]">
          <span className="mb-[0.3em] block" style={{ width: "2.4em", height: "3px", backgroundColor: t.accent }} />
          <span style={label}>{children}</span>
        </h2>
      );

    case "sidelined":
      return (
        <h2 className="mb-[0.5em]" style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: "0.5em" }}>
          <span style={label}>{children}</span>
        </h2>
      );

    case "ruled":
      return (
        <h2 className="mb-[0.5em] flex items-center gap-[0.6em]">
          <span style={label}>{children}</span>
          <span className="flex-1" style={{ height: "1px", backgroundColor: t.accent, opacity: 0.45 }} />
        </h2>
      );

    case "underline":
      return (
        <h2 className="mb-[0.5em] pb-[0.18em]" style={{ ...label, borderBottom: `1px solid ${t.accent}` }}>
          {children}
        </h2>
      );

    default:
      return (
        <h2 className="mb-[0.5em]" style={label}>
          {children}
        </h2>
      );
  }
}

/**
 * A section, optionally carrying its own heading colour.
 *
 * Pass `r` and `id` and the heading picks up `settings.sectionColors[id]`,
 * falling back to the accent. Only the heading and its decoration recolour —
 * the body stays on the document palette, which is what keeps a resume with
 * several section colours from looking like a ransom note.
 *
 * Deliberately prop-driven rather than context-driven: the marketing homepage
 * renders these templates as a server component, and React context would drag
 * the whole template tree into the client bundle.
 */
export function Section({
  r,
  id,
  t,
  title,
  index,
  children,
}: {
  r?: Resume;
  id?: SectionId;
  t: Tokens;
  title: string;
  index?: number;
  children: ReactNode;
}) {
  const custom = r && id ? r.settings.sectionColors?.[id] : undefined;
  const headTokens = custom ? { ...t, accent: custom } : t;
  return (
    <section style={{ marginBottom: sectionGap(t) }}>
      <SectionHead t={headTokens} index={index}>
        {title}
      </SectionHead>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* identity                                                                   */
/* -------------------------------------------------------------------------- */

export function Name({
  r,
  t,
  align = "left",
  onAccent = false,
}: Ctx & { align?: "left" | "center" | "right"; onAccent?: boolean }) {
  const full = r.basics.fullName || "Your Name";
  const parts = full.split(/\s+/);
  const first = parts.slice(0, -1).join(" ");
  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  return (
    <div style={{ textAlign: align }}>
      <h1
        style={{
          fontFamily: FONT_STACKS[t.headingFont],
          fontSize: `${t.nameSize}em`,
          fontWeight: t.nameWeight,
          textTransform: t.nameUpper ? "uppercase" : "none",
          letterSpacing: t.nameUpper ? "0.03em" : "-0.01em",
          lineHeight: 1.05,
          color: onAccent ? t.onAccent : t.accent,
        }}
      >
        {t.nameTwoTone && last ? (
          <>
            {first}{" "}
            <span style={{ fontWeight: 400, fontStyle: "italic", color: onAccent ? t.onAccent : t.muted }}>
              {last}
            </span>
          </>
        ) : (
          full
        )}
      </h1>
      {r.basics.title && (
        <p
          className="mt-[0.35em]"
          style={{
            fontSize: "1.05em",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: onAccent ? t.onAccent : t.muted,
            opacity: onAccent ? 0.88 : 1,
          }}
        >
          {r.basics.title}
        </p>
      )}
    </div>
  );
}

export function Photo({ r, t, size = "9em" }: Ctx & { size?: string }) {
  if (t.photo === "none" || !r.settings.showPhoto) return null;

  const radius =
    t.photoFrame === "arch"
      ? `${size} ${size} 0.6em 0.6em`
      : t.photo === "circle"
        ? "9999px"
        : t.photo === "rounded"
          ? "0.8em"
          : "0";

  const frame: CSSProperties =
    t.photoFrame === "framed"
      ? { padding: "0.5em", backgroundColor: t.dark ? tint(t.accent, 0.25) : "#ffffff", borderRadius: radius }
      : {};

  const initials =
    r.basics.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "—";

  const inner = r.basics.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={r.basics.photo}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        display: "block",
        border: t.photoFrame === "plain" ? `3px solid ${t.accent}` : undefined,
      }}
    />
  ) : (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: t.accent,
        color: t.onAccent,
        fontSize: "1.6em",
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  );

  return t.photoFrame === "framed" ? <div style={frame}>{inner}</div> : inner;
}

export function Contact({ r, t, layout = "list" }: Ctx & { layout?: "list" | "inline" | "grid" }) {
  const items = [r.basics.phone, r.basics.email, r.basics.location, r.basics.website].filter(Boolean);
  if (!items.length) return null;

  if (layout === "inline") {
    return (
      <p style={{ fontSize: "0.94em", color: t.muted }}>
        {items.map((v, i) => (
          <span key={i}>
            {i > 0 && <span style={{ color: t.accent, margin: "0 0.5em" }}>|</span>}
            {v}
          </span>
        ))}
      </p>
    );
  }

  if (layout === "grid") {
    const labels = ["Phone", "Email", "Address", "Website"];
    return (
      <div className="grid grid-cols-2 gap-x-[1.5em] gap-y-[0.7em]" style={{ fontSize: "0.94em" }}>
        {[r.basics.phone, r.basics.email, r.basics.location, r.basics.website].map((v, i) =>
          v ? (
            <div key={i}>
              <p style={{ fontWeight: 700, color: t.accent }}>{labels[i]}</p>
              <p className="break-words">{v}</p>
            </div>
          ) : null,
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-[0.3em]" style={{ fontSize: "0.94em" }}>
      {items.map((v, i) => (
        <li key={i} className="break-words">
          {v}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* content blocks                                                             */
/* -------------------------------------------------------------------------- */

function Bullet({ t }: { t: Tokens }) {
  if (t.bullet === "none") return null;
  return (
    <span aria-hidden className="shrink-0" style={{ color: t.accent, marginRight: "0.5em" }}>
      {GLYPH[t.bullet]}
    </span>
  );
}

export function Summary({ r }: Ctx) {
  if (!r.basics.summary) return null;
  return <p className="text-justify">{r.basics.summary}</p>;
}

function SkillRow({ t, skill }: { t: Tokens; skill: Skill }) {
  const showMeter = t.meter !== "none" && skill.level !== null;
  return (
    <li
      className={showMeter ? "flex items-center justify-between" : "flex"}
      style={{ marginBottom: showMeter ? "0.35em" : "0.22em" }}
    >
      <span className="flex min-w-0">
        <Bullet t={t} />
        <span>{skill.name}</span>
      </span>
      {showMeter && <Meter t={t} value={(skill.level as number) / 5} />}
    </li>
  );
}

export function Skills({ r, t }: Ctx) {
  if (!r.skills.length) return null;
  if (t.skillsInline) {
    return (
      <p style={{ fontSize: "0.96em" }}>
        {r.skills.filter((s) => s.name.trim()).map((s) => s.name).join("  ·  ")}
      </p>
    );
  }
  return (
    <ul style={{ fontSize: "0.96em" }}>
      {r.skills.filter((s) => s.name.trim()).map((s) => (
        <SkillRow key={s.id} t={t} skill={s} />
      ))}
    </ul>
  );
}

/** Two-column skill grid, used where the main column is full width. */
export function SkillsGrid({ r, t }: Ctx) {
  if (!r.skills.length) return null;
  if (t.skillsInline) return <Skills r={r} t={t} />;
  return (
    <ul className="grid grid-cols-2 gap-x-[1.8em]" style={{ fontSize: "0.96em" }}>
      {r.skills.filter((s) => s.name.trim()).map((s) => (
        <SkillRow key={s.id} t={t} skill={s} />
      ))}
    </ul>
  );
}

export function Experience({ r, t, variant = "plain" }: Ctx & { variant?: "plain" | "timeline" }) {
  if (!r.experience.length) return null;
  return (
    <div>
      {r.experience.map((e) => {
        const bullets = e.bullets.filter((b) => b.trim());
        return (
          <article
            key={e.id}
            className="avoid-break relative"
            style={{
              marginBottom: itemGap(t),
              paddingLeft: variant === "timeline" ? "1.4em" : undefined,
              borderLeft: variant === "timeline" ? `2px solid ${tint(t.accent, 0.35)}` : undefined,
            }}
          >
            {variant === "timeline" && (
              <span
                className="absolute"
                style={{
                  left: "-0.42em",
                  top: "0.35em",
                  width: "0.72em",
                  height: "0.72em",
                  borderRadius: "9999px",
                  backgroundColor: t.accent,
                }}
              />
            )}
            <div className="flex items-baseline justify-between gap-[1em]">
              <h3 style={{ fontWeight: 700, fontSize: "1.06em", color: t.accent }}>{e.company}</h3>
              <span className="shrink-0" style={{ fontSize: "0.9em", color: t.muted }}>
                {[e.start, e.end].filter(Boolean).join(" — ")}
              </span>
            </div>
            <p style={{ fontSize: "0.98em", color: t.muted, marginBottom: "0.35em" }}>
              {[e.role, e.employment, e.location].filter(Boolean).join(" · ")}
            </p>
            <ul>
              {bullets.map((b, i) => (
                <li key={i} className="flex" style={{ marginBottom: "0.22em", fontSize: "0.96em" }}>
                  <Bullet t={t} />
                  <span className="text-justify">{b}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

export function Education({ r, t, layout = "stacked" }: Ctx & { layout?: "stacked" | "rows" }) {
  if (!r.education.length) return null;
  if (layout === "rows") {
    return (
      <div style={{ fontSize: "0.96em" }}>
        {r.education.map((e) => (
          <div
            key={e.id}
            className="avoid-break flex items-baseline justify-between gap-[1em]"
            style={{ marginBottom: "0.3em" }}
          >
            <span>
              <span style={{ fontWeight: 600 }}>{e.course || e.level}</span>
              {e.school && ` — ${e.school}`}
            </span>
            <span className="shrink-0" style={{ color: t.muted }}>
              {e.year}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ fontSize: "0.96em" }}>
      {r.education.map((e) => (
        <div key={e.id} className="avoid-break" style={{ marginBottom: "0.6em" }}>
          <p style={{ fontWeight: 700 }}>{e.school}</p>
          {e.course && <p>{e.course}</p>}
          <p style={{ color: t.muted }}>{[e.level, e.year].filter(Boolean).join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}

export function Languages({ r, t, layout = "list" }: Ctx & { layout?: "list" | "inline" }) {
  if (!r.languages.length) return null;
  const text = (l: { name: string; level: string }) => (l.level ? `${l.name} (${l.level})` : l.name);

  if (layout === "inline") {
    return <p style={{ fontSize: "0.96em" }}>{r.languages.map(text).join("  ·  ")}</p>;
  }

  return (
    <ul style={{ fontSize: "0.96em" }}>
      {r.languages.map((l) => {
        const value = t.meter !== "none" ? wordLevel(l.level) : null;
        return (
          <li
            key={l.id}
            className={value !== null ? "flex items-center justify-between" : ""}
            style={{ marginBottom: value !== null ? "0.35em" : "0.2em" }}
          >
            <span>{value !== null ? l.name : text(l)}</span>
            {value !== null && <Meter t={t} value={value} />}
          </li>
        );
      })}
    </ul>
  );
}

export function References({ r, t }: Ctx) {
  if (!r.settings.showReferences || !r.references.length) return null;
  return (
    <div style={{ fontSize: "0.96em" }}>
      {r.settings.hideReferenceContacts ? (
        <p>Available upon request.</p>
      ) : (
        r.references.map((x) => (
          <div key={x.id} className="avoid-break" style={{ marginBottom: "0.6em" }}>
            <p style={{ fontWeight: 700 }}>{x.name}</p>
            {(x.role || x.company) && <p>{[x.role, x.company].filter(Boolean).join(", ")}</p>}
            {x.phone && <p style={{ color: t.muted }}>{x.phone}</p>}
            {x.email && (
              <p className="break-all" style={{ color: t.muted }}>
                {x.email}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export function Declaration({ r, t }: Ctx) {
  if (!r.settings.showDeclaration || !r.declaration) return null;
  return (
    <section
      className="avoid-break"
      style={{ marginTop: sectionGap(t), paddingTop: "0.8em", borderTop: `1px solid ${t.line}` }}
    >
      <p className="text-justify" style={{ fontSize: "0.9em", color: t.muted }}>
        {r.declaration}
      </p>
      {r.settings.showSignature && (
        <p
          className="mt-[2.5em] inline-block"
          style={{ borderTop: `1px solid ${t.muted}`, paddingTop: "0.3em", fontSize: "0.96em" }}
        >
          {r.basics.fullName}
        </p>
      )}
    </section>
  );
}

/** Everything that normally lives in a sidebar, in one call. */
export function SideSections({ r, t, from = 1 }: Ctx & { from?: number }) {
  let n = from;
  return (
    <>
      <Section r={r} id="contact" t={t} title="Contact" index={n++}>
        <Contact r={r} t={t} />
      </Section>
      {r.skills.length > 0 && (
        <Section r={r} id="skills" t={t} title="Skills" index={n++}>
          <Skills r={r} t={t} />
        </Section>
      )}
      {r.languages.length > 0 && (
        <Section r={r} id="languages" t={t} title="Languages" index={n++}>
          <Languages r={r} t={t} />
        </Section>
      )}
      {r.education.length > 0 && (
        <Section r={r} id="education" t={t} title="Education" index={n++}>
          <Education r={r} t={t} />
        </Section>
      )}
      {r.settings.showReferences && r.references.length > 0 && (
        <Section r={r} id="references" t={t} title="References" index={n++}>
          <References r={r} t={t} />
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* decoration                                                                 */
/* -------------------------------------------------------------------------- */

/** Background furniture. Absolutely positioned, never in the text flow. */
export function Decoration({ t }: { t: Tokens }) {
  if (t.decor === "none") return null;

  if (t.decor === "corner") {
    return (
      <>
        <span
          className="pointer-events-none absolute"
          style={{
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderTop: `4.5em solid ${t.accent}`,
            borderRight: "4.5em solid transparent",
          }}
        />
        <span
          className="pointer-events-none absolute"
          style={{
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderBottom: `4.5em solid ${t.accent}`,
            borderLeft: "4.5em solid transparent",
          }}
        />
      </>
    );
  }

  if (t.decor === "dot-grid") {
    return (
      <span
        className="pointer-events-none absolute"
        style={{
          top: "2.5em",
          right: "2.5em",
          width: "9em",
          height: "6em",
          backgroundImage: `radial-gradient(${t.accent} 1.4px, transparent 1.4px)`,
          backgroundSize: "1.15em 1.15em",
          opacity: 0.55,
        }}
      />
    );
  }

  return (
    <>
      <span
        className="pointer-events-none absolute"
        style={{
          top: "-6em",
          right: "-6em",
          width: "18em",
          height: "18em",
          borderRadius: "9999px",
          backgroundColor: tint(t.accent, 0.14),
        }}
      />
      <span
        className="pointer-events-none absolute"
        style={{
          bottom: "-4em",
          left: "-4em",
          width: "12em",
          height: "12em",
          borderRadius: "9999px",
          backgroundColor: tint(t.accent, 0.09),
        }}
      />
    </>
  );
}
