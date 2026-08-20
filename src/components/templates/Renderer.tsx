import type { Resume } from "@/lib/types";
import { getTemplate } from "@/lib/templates/catalog";
import type { Tokens } from "@/lib/templates/types";
import { ENGINES } from "./engines";

/**
 * Resolves a resume's template id to a spec, applies the user's accent override
 * if they picked one, and hands the tokens to the matching engine.
 */
export function resolveTokens(r: Resume): Tokens {
  const spec = getTemplate(r.settings.template);
  return r.settings.accent ? { ...spec.tokens, accent: r.settings.accent } : spec.tokens;
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
