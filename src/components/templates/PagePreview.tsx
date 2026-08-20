import type { Resume } from "@/lib/types";
import Renderer from "./Renderer";

export const PAGE_W = 794; // A4 width at 96dpi
export const PAGE_H = 1123;

/**
 * A scaled, non-interactive render of one template, clipped to a single page.
 * Used for gallery thumbnails, the full-size preview, and the template chip in
 * the editor — all the same code path as the live preview, so what you see in a
 * thumbnail is what the real page does.
 */
export default function PagePreview({
  r,
  templateId,
  width,
}: {
  r: Resume;
  templateId: string;
  width: number;
}) {
  const scale = width / PAGE_W;
  return (
    <div className="relative overflow-hidden bg-white" style={{ width, height: Math.round(PAGE_H * scale) }}>
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: PAGE_W, transform: `scale(${scale})`, fontSize: "12px" }}
      >
        <Renderer r={{ ...r, settings: { ...r.settings, template: templateId, accent: "" } }} />
      </div>
    </div>
  );
}
