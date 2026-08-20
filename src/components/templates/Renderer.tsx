import type { Resume } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import type { Tokens } from "@/lib/templates/types";
import { ENGINES } from "./engines";

/**
 * Resolves a resume's template to a spec and lays the user's per-role colour
 * overrides on top. An absent override means "keep the template's own value",
 * which is what lets you switch templates without dragging the previous
 * design's palette along.
 */
export function resolveTokens(r: Resume): Tokens {
  const spec = getTemplate(r.settings.template);
  const c = r.settings.colors ?? {};
  // `settings.accent` is the pre-overrides field; honour it if nothing newer set one.
  const accent = c.accent || r.settings.accent || spec.tokens.accent;

  const tokens: Tokens = {
    ...spec.tokens,
    accent,
    surface: c.surface || spec.tokens.surface,
    ink: c.ink || spec.tokens.ink,
    pageBg: c.page || spec.tokens.pageBg,
    onAccent: c.onAccent || spec.tokens.onAccent,
  };

  return tokens;
}

export default function Renderer({ r }: { r: Resume }) {
  const spec = getTemplate(r.settings.template);
  const Engine = ENGINES[spec.engine];
  const t = resolveTokens(r);
  return (
    <div
      className="resume-doc"
      // minHeight is one A4 page at 96dpi, so a dark template's background
      // covers the whole sheet even when the content is short.
      style={{ backgroundColor: t.pageBg, minHeight: "1123px" }}
    >
      <Engine r={r} t={t} spec={spec} />
    </div>
  );
}
