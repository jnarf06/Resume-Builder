# Resume Builder

A local-first resume editor: edit on the left, see the page render live on the right,
export to PDF through the browser's print dialog. Built for Philippine-format resumes
(photo, references, declaration are all supported and on by default), with 77 templates
tagged by industry and marked for ATS safety.

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Marketing homepage — hero, the ATS argument, features, template showcase, FAQ. A server component: no state, no localStorage, and the FAQ uses `<details>` rather than a hook. |
| `/dashboard` | Your resume library: cards with live thumbnails, scores, duplicate/export/delete. |
| `/editor` | The editor: form, live A4 preview, Check tab, template gallery, PDF export. |
| `/editor?id=<id>` | Opens a specific resume. This is what the dashboard cards link to. |

Both pages read the same library through `useLibrary()` in `src/lib/useLibrary.ts`, which
handles hydration and the debounced autosave. The editor reads `?id=` via
`useSearchParams`, so it is wrapped in a `Suspense` boundary — required for the
statically exported page.

## How it works

Everything lives in the browser. There is no server, no database and no account —
resumes are stored in `localStorage` and autosave 400ms after you stop typing. Use
**Export data** to get a `.json` backup and **Import** to load it on another machine.

On first run the library loads a sample resume ("Juan Dela Cruz") so the templates have
something to render. **New** starts blank; **New from sample** loads the demo again.
The sample is written as a *good* resume — every bullet carries a number — so it works
as a worked example of what the Check tab is asking for.

The sample's name, its `@example.com` addresses and its stock phone number are all in
the placeholder list in `audit.ts`, so a resume still carrying them gets flagged instead
of quietly going out the door.

## Templates

77 templates, browsable from the **Templates** button or the template card in the editor.
Filter by industry, search by name, or tick **ATS-safe only**.

They are not 77 hand-written components. A template is a **structural engine** plus a set
of **style tokens**, so adding one is a data entry in a catalogue file rather than a new
component:

| Engine | Shape | ATS-safe |
| --- | --- | --- |
| `stack` | Plain single column, no colour blocks | yes |
| `centered` | Centred name over a rule, one column | yes |
| `banner` | Full-width accent header, one column below | yes |
| `timeline` | One column with a rail down the experience list | yes |
| `cards` | Each section in a bordered card | yes |
| `edge` | Thin accent strip down one edge | yes |
| `compact` | Experience full width, short sections in a grid | yes |
| `sidebar` | Tinted column left or right of the main content | **no** |
| `wave` | Colour field closed off by a curve | **no** |
| `modular` | Content in filled blocks on a grid | **no** |
| `editorial` | Magazine setting, two-tone name, two-column body | **no** |
| `memphis` | Geometric furniture — circles, dot grids, corner triangles | **no** |
| `split` | Colour field the portrait straddles | **no** |

Tokens carry everything else: accent, surface and page colours, font stack (six of them,
all system fonts so nothing is fetched at runtime), heading treatment (`underline`, `bar`,
`boxed`, `sidelined`, `ruled`, `chip`, `highlight`, `numbered`, `leader`, `plain`), name
case, size and two-tone setting, spacing density, bullet glyph, photo shape and frame
(`plain`, `framed`, `arch`), sidebar width, skill meters (`bar`, `dots`, `stars`),
background decoration (`corner`, `dot-grid`, `shapes`), and a `dark` flag that flips the
page to a dark ground with reversed-out type.

### Colours

Five roles can be overridden per resume, each independently: **accent** (headings, rules,
bullets, banner fills), **panel** (sidebar and card tint), **page**, **body text**, and
**on accent** (text over a filled area).

Every colour control in the app is one component, `ColorField.tsx`, offering three ways in:
a swatch grid of 15 hues × 5 steps plus 7 neutrals, a **hex input** (accepts `#abc`,
`abc`, `#1F3A5F`, with whitespace, and rejects anything else without clobbering the current
colour), and the OS colour picker for the full spectrum. The current value is always shown
as a hex code next to the label.

A role left unset follows the template, so switching designs still changes the whole look;
only the roles you overrode stay put. `resolveTokens()` in `Renderer.tsx` layers
`settings.colors` over the spec's tokens.

**Per-section heading colours** sit on top of that. Each section — profile, contact, skills,
experience, education, languages, references — can pin its own heading colour, and the
control lives inside that section's panel in the editor rather than in a central palette.
Unset sections follow the accent. Only the heading and its decoration (bar, chip, box,
rule, number badge) recolour; the body stays on the document palette, which stops a resume
with several section colours reading like a ransom note.

`Section` takes optional `r` and `id` props and resolves `settings.sectionColors[id]`
itself. It is prop-driven rather than context-driven on purpose: the marketing homepage
renders these templates as a *server* component, and React context would pull the entire
template tree into the client bundle.

### Skill and language meters

Skills are `{ id, name, level }` where `level` is 1–5 or `null` for unrated. The editor
gives each skill a row with a name field and a click-to-set 1–5 rating; clicking the
current value clears it. **Paste a list** swaps in a newline-separated list while keeping
the ratings of any names that still match.

Templates carrying a `meter` token (`bar`, `dots`, `stars`) draw rated skills; the rest
print names only and quietly ignore the rating. The Skills panel says which of the two the
current template does.

Languages still use their free-text Level field — `Native`, `Fluent`, `Advanced`,
`Conversational`, `Basic` map onto the same scale, as does a bare number.

An earlier version stored skills as strings with a `"Google Ads | 4"` pipe syntax.
`migrate()` in `storage.ts` parses those into the structured shape, and runs on everything
arriving from outside: localStorage, JSON import, and shared links.

**The ATS badge is the important part.** A parser reads a PDF's text layer top to bottom,
so a two-column page can interleave the sidebar into your job bullets. Sidebar templates
are marked accordingly. Keep one of each: a sidebar design for a human, an ATS-safe one
for job portals. **Duplicate** plus a template switch takes about five seconds.

Industry tags (`bpo`, `healthcare`, `maritime`, `construction`, `va`, …) only filter the
gallery toward templates whose tone suits that field — conservative shapes for government
and legal, denser ones for maritime service records, warmer ones for retail and
hospitality. Any template works with any resume.

## Custom sections

Built-in sections do not cover everything a Philippine resume needs — Seminars &
Trainings, Eligibility, Certifications, Affiliations. `custom: CustomSection[]` lets a
user invent their own, with three layouts:

| Layout | For |
| --- | --- |
| `bullets` | Certifications, awards, eligibility |
| `text` | A short statement or objective |
| `entries` | Dated rows: title, organisation, date, optional detail |

Each section carries a `placement` (`main` or `side`) and its own optional heading colour.
`CustomSections` in `primitives.tsx` filters by placement and renders the right layout;
every engine calls it, so a custom section appears in all 77 templates. Single-column
engines ask for `placement: "all"` so a section marked for a sidebar is never silently
dropped on a template that has none — the editor says so explicitly when that happens.

## No accounts, by design

There is no login and no user identity. Resumes are keyed to the browser they were made
in. Three things close the gaps that would otherwise create:

- **Share link** (`src/lib/share.ts`) encodes a resume into the URL *fragment*
  (`/editor#r=…`). Fragments are never sent in an HTTP request, so a shared link reaches
  the recipient without the data touching a server. JSON is deflated and base64url-encoded
  — a realistic resume lands around 400 characters. Photos are stripped: a data URL is
  100–400KB and will not fit in a URL.
- **Backup nudge** warns when the newest edit is later than the last JSON export.
  Clearing site data is silent and total, so the app has to say so.
- **Storage probe** detects a browser that exposes `localStorage` but throws on write
  (private browsing, locked-down profiles) and shows a red banner. Otherwise the app looks
  like it is saving and silently is not.

`bootstrap()` seeds the sample resume on a genuine first visit only, tracked with a
`rb.seeded.v1` flag. Without it, "Clear all data" would be undone by the next reload.

## The Check tab

`src/lib/audit.ts` runs a set of rules over the resume and scores it out of 100:

- **Placeholder text** — this app's sample content, plus stock strings design tools leave
  behind ("Wardiere University", `hello@reallygreatsite.com`). Often invisible on screen
  but still in the PDF's text layer, where the parser reads it. This is the check that
  motivated the whole tab.
- **Overlapping roles** — flagged unless at least one of the two carries a different
  employment type, which makes the overlap read as deliberate.
- **Reversed dates** and **employment gaps** of six months or more.
- **Bullets without numbers** — warns when under a quarter of them contain a figure.
- **Weak openers** ("Responsible for…"), over-long bullets, empty roles.
- **Summary length**, **skill count**, and PH-specific conventions such as printing
  reference phone numbers.

Dates parse from `"Jul 2020"`, `"July 2020"` or `"2020"`; `"Present"` resolves to today.

## PDF export

**Download PDF** calls `window.print()`. In the browser dialog choose *Save as PDF*,
leave **Margins on Default**, and tick **Background graphics** — the accent bar and
sidebar tint are backgrounds, and Chrome drops them otherwise.

Margins must stay on *Default* because the page margins are set in CSS and Chrome's
dropdown overrides them. `@page` takes `14mm 0`: vertical breathing room on every page,
nothing horizontal so sidebars and header bands still bleed to the paper edge.
`@page :first` drops the top margin so the coloured header band starts flush.

Two multi-page problems are handled explicitly:

- **The sidebar tint used to stop after page one.** Chrome does not repeat a flex item's
  background across page fragments, so the `<aside>` painted only on its first fragment.
  `SidebarEngine` now draws the tint as a `linear-gradient` stripe on the document root —
  a block-level background, which does repeat.
- **Headings stranded at the foot of a page** are prevented with `break-after: avoid-page`
  on `h2`/`h3`, and `orphans: 3; widows: 3` stops a single dangling line of a paragraph.

Print rules live at the bottom of `src/app/globals.css`. `.no-print` hides the app
chrome, `.avoid-break` keeps a job entry from splitting across pages, and the overflow
resets exist because the editor lives inside fixed-height scrolling containers, which
would otherwise clip the printed output.

## Layout

```
src/
  app/page.tsx                    marketing homepage (server component)
  app/dashboard/page.tsx          library: cards, stats, featured templates
  app/editor/page.tsx             editor shell, template gallery, print
  lib/useLibrary.ts               hydration + debounced autosave, shared by both pages
  lib/types.ts                    the Resume shape
  lib/seed.ts                     sample resume, blank resume, field hints
  lib/storage.ts                  localStorage, JSON import/export, photo downscaling
  lib/audit.ts                    the Check rules
  lib/templates/types.ts          engine ids, style tokens, industry list
  lib/templates/defaults.ts       base tokens, dark preset, the spec() builder
  lib/templates/catalog.ts        54 specs on the conventional engines
  lib/templates/catalog-extra.ts  23 specs on the shape-led engines
  components/AuditPanel.tsx
  components/TemplateGallery.tsx  filterable picker with live thumbnails
  components/editor/              form fields and the editor panel
  components/templates/           primitives, the 13 engines, Renderer
```

Uploaded photos are downscaled to 480px and re-encoded as JPEG before being stored —
a raw phone photo is several MB of base64 and would blow the ~5MB `localStorage` quota
on its own.

## Adding a template

Add a `spec({ ... })` entry to either catalogue: an id, a name, a one-line blurb, an
engine, industry tags, and any token overrides. It appears in the gallery immediately.
`atsSafe` is inferred from the engine unless you set it. Both catalogues import `spec`
from `defaults.ts` — never from each other, or the cycle leaves `spec` undefined at
module-evaluation time and the build fails during static export.

A genuinely new *shape* means a new engine in `engines.tsx` or `engines-extra.tsx`, plus
an entry in the `ENGINES` map and the `EngineId` union. Build it from the primitives, use
`.avoid-break` on anything that should not straddle a page break, and size text in `em`
so the text-size slider keeps working.
