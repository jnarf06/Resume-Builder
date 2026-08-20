import Link from "next/link";
import type { ReactNode } from "react";
import { MOCK } from "@/lib/seed";
import { ALL_TEMPLATES, getTemplate } from "@/lib/templates/catalog";
import { INDUSTRIES } from "@/lib/templates/types";
import PagePreview from "@/components/templates/PagePreview";

/**
 * Marketing homepage. Deliberately a server component — nothing here touches
 * localStorage or React state, so it ships no client JS beyond what the
 * template previews need, and the FAQ uses <details> rather than a hook.
 */

const SHOWCASE = [
  "ortigas",
  "lagoon",
  "manila-plain",
  "broadsheet",
  "makati",
  "onyx",
  "confetti",
  "harbour-split",
];

const ATS_COUNT = ALL_TEMPLATES.filter((t) => t.atsSafe).length;

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteNav />
      <Hero />
      <ProofBand />
      <TheProblem />
      <Features />
      <Showcase />
      <HowItWorks />
      <Checker />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded bg-slate-900 text-xs font-bold text-white">
            R
          </span>
          <span className="text-sm font-bold tracking-tight">Resume Builder</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-5 text-sm text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#templates" className="hover:text-slate-900">
            Templates
          </a>
          <a href="#how" className="hover:text-slate-900">
            How it works
          </a>
          <a href="#faq" className="hover:text-slate-900">
            FAQ
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:block"
          >
            My resumes
          </Link>
          <Link
            href="/editor"
            className="rounded-md bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Build my resume
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Free · no account · nothing leaves your browser
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Most resumes are rejected
            <br />
            before a person reads them.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
            Applicant tracking systems read your PDF as plain text, top to bottom. A beautiful
            two-column design can hand them your sidebar shuffled into your job bullets. This builder
            shows you exactly which templates survive that, and checks your writing while you type.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/editor"
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Build my resume — free
            </Link>
            <a
              href="#templates"
              className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              See the {ALL_TEMPLATES.length} templates
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Works offline. Export to PDF, or to JSON to back up and move between machines.
          </p>
        </div>

        {/* stacked previews */}
        <div className="relative hidden h-[400px] lg:block">
          <div className="absolute left-4 top-8 rotate-[-6deg] rounded-lg shadow-2xl ring-1 ring-slate-900/10">
            <PagePreview r={MOCK} templateId="manila-plain" width={200} />
          </div>
          <div className="absolute left-44 top-0 rotate-[3deg] rounded-lg shadow-2xl ring-1 ring-slate-900/10">
            <PagePreview r={MOCK} templateId="lagoon" width={220} />
          </div>
          <div className="absolute left-[19rem] top-24 rotate-[8deg] rounded-lg shadow-2xl ring-1 ring-slate-900/10">
            <PagePreview r={MOCK} templateId="onyx" width={180} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofBand() {
  const items = [
    { n: String(ALL_TEMPLATES.length), l: "templates" },
    { n: String(ATS_COUNT), l: "ATS-safe layouts" },
    { n: String(INDUSTRIES.length), l: "industries tagged" },
    { n: "0", l: "data sent anywhere" },
  ];
  return (
    <section className="border-b border-slate-200 bg-slate-900">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 px-6 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.l} className="py-6 text-center">
            <p className="text-2xl font-bold tabular-nums text-white">{i.n}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">{i.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TheProblem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The thing nobody tells you</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Your design and your parseability are in tension.
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              A recruiter opening your PDF sees a layout. A tracking system sees a text stream. Those
              are different things, and the prettier your layout, the further apart they drift.
            </p>
            <p>
              Design tools make this worse in a way you cannot see: sample text like{" "}
              <span className="font-mono text-xs text-slate-800">Wardiere University</span> often stays
              in the file behind your real content — invisible on screen, perfectly readable to a
              parser.
            </p>
            <p className="font-medium text-slate-800">
              So keep two. A designed resume for the human, a plain one for the portal. Same content,
              one click apart.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
            <div className="overflow-hidden rounded shadow-sm ring-1 ring-slate-900/10">
              <PagePreview r={MOCK} templateId="manila-plain" width={210} />
            </div>
            <p className="mt-3 text-sm font-bold text-emerald-800">Parses cleanly</p>
            <p className="mt-0.5 text-xs leading-relaxed text-emerald-900/70">
              One column. Name, then summary, then jobs — in that order, in the text layer.
            </p>
          </div>
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4">
            <div className="overflow-hidden rounded shadow-sm ring-1 ring-slate-900/10">
              <PagePreview r={MOCK} templateId="ortigas" width={210} />
            </div>
            <p className="mt-3 text-sm font-bold text-amber-800">Looks better to a person</p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-900/70">
              Two columns. Send it directly; a parser may interleave the sidebar into your bullets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items: { title: string; body: string }[] = [
    {
      title: "Live A4 preview",
      body: "The page renders as you type, at real proportions. No “generate” button, no surprise on export — what you see is what prints.",
    },
    {
      title: `${ALL_TEMPLATES.length} templates, ${ATS_COUNT} ATS-safe`,
      body: "Every template is labelled. Filter the gallery to only the layouts a job portal can read, or browse everything when a human is receiving the file.",
    },
    {
      title: "A checker that is specific",
      body: "Not a score with no reasoning. It names the overlapping dates, the leftover placeholder text, the bullets with no numbers, and tells you why each one matters.",
    },
    {
      title: "Philippine format, switchable",
      body: "Photo, references and the declaration are supported and on by default. Toggle them off for US, UK or Australian applications, where they count against you.",
    },
    {
      title: "Skill and language meters",
      body: "Bars, dots or stars where the design calls for them. Add a level with a pipe — Google Ads | 5 — and plain templates quietly drop it again.",
    },
    {
      title: "Yours, and only yours",
      body: "No sign-up, no server, no analytics on your content. Resumes live in your browser. Export JSON to back them up or move machines.",
    },
    {
      title: "Share without uploading",
      body: "Share link puts the whole resume inside the link itself, in the part of a URL browsers never send to a server. Open it on your phone and it is there — no account on either end.",
    },
  ];

  return (
    <section id="features" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you actually get</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {ALL_TEMPLATES.length} templates, tagged by industry
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Conservative shapes for government and legal, dense ones for seafaring service records,
            warm ones for retail and hospitality, bold ones for creative work. Any template works with
            any resume — the tag just points you somewhere sensible to start.
          </p>
        </div>
        <Link
          href="/editor"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Browse all in the editor
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {INDUSTRIES.map((i) => (
          <span
            key={i.id}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
          >
            {i.label}
          </span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {SHOWCASE.map((id) => {
          const spec = getTemplate(id);
          return (
            <Link key={id} href="/editor" className="group">
              <div className="overflow-hidden rounded-lg border-2 border-slate-200 shadow-sm transition group-hover:border-slate-400 group-hover:shadow-lg">
                <PagePreview r={MOCK} templateId={id} width={240} />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                {spec.name}
                {spec.atsSafe && (
                  <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                    ATS
                  </span>
                )}
              </p>
              <p className="text-xs leading-snug text-slate-500">{spec.blurb}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      t: "Fill in the form",
      b: "One panel, plain fields. Bullets are one per line. Start blank, or load a filled example and edit over it.",
    },
    {
      n: "2",
      t: "Pick a template",
      b: "Browse 77 designs previewed with real content. Filter to ATS-safe when the file is going into a job portal.",
    },
    {
      n: "3",
      t: "Fix what the checker finds",
      b: "Placeholder text, overlapping dates, bullets with no numbers. Each item says what is wrong and why it matters.",
    },
    {
      n: "4",
      t: "Export the PDF",
      b: "Print to PDF from the browser. Margins none, background graphics on. Duplicate and switch templates for a second version.",
    },
  ];
  return (
    <section id="how" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Four steps, about twenty minutes</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-3 text-sm font-bold">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Checker() {
  const rows: { level: "Fix" | "Check" | "Tip"; title: string; detail: string }[] = [
    {
      level: "Fix",
      title: 'Placeholder text still present: "wardiere"',
      detail: "Sample content from a design tool. Invisible on screen, readable to a parser.",
    },
    {
      level: "Check",
      title: "Two roles overlap by ~24 months",
      detail: "Set the employment type on one so the overlap reads as deliberate, not as an error.",
    },
    {
      level: "Check",
      title: "Only 2 of 45 bullets contain a number",
      detail: "Duties are forgettable; results are not. Add spend managed, growth, team size.",
    },
    {
      level: "Tip",
      title: "Reference phone numbers are printed on the resume",
      detail: "Normal in the Philippines, but it exposes their numbers to every job board.",
    },
  ];
  const chip = {
    Fix: "bg-red-100 text-red-700",
    Check: "bg-amber-100 text-amber-800",
    Tip: "bg-sky-100 text-sky-800",
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The Check tab</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Advice you can act on, not a mystery score.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The checker runs over your resume as you write and names what is wrong in your specific
            document — which two jobs overlap, how many bullets carry a figure, which placeholder is
            still hiding in the file. There is a score too, but the list is the point.
          </p>
          <Link
            href="/editor"
            className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Check my resume
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold">Resume check</span>
              <span className="text-2xl font-bold tabular-nums">64</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[64%] bg-amber-500" />
            </div>
            <p className="mt-2 text-xs text-slate-500">4 items to look at.</p>
          </div>
          <ul className="space-y-2.5">
            {rows.map((r) => (
              <li key={r.title} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${chip[r.level]}`}
                  >
                    {r.level}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{r.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{r.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const qs: { q: string; a: ReactNode }[] = [
    {
      q: "Is it really free?",
      a: "Yes, and there is nothing to sign up for. It runs entirely in your browser — there is no server to charge you for.",
    },
    {
      q: "Where are my resumes stored?",
      a: "In your browser's local storage, on this device only. Clearing site data deletes them, so use Export to keep a JSON backup. Import brings it back on any machine.",
    },
    {
      q: "Can I move a resume to my phone without an account?",
      a: "Yes. Share link encodes the resume into the URL fragment — the part after the # that browsers never transmit to a server. Send it to yourself, open it, and it saves into that browser. Photos are left out because they are too large for a URL.",
    },
    {
      q: "What does the ATS badge actually mean?",
      a: `It marks single-column layouts whose text layer reads top to bottom, which is how a tracking system parses a PDF. ${ATS_COUNT} of the ${ALL_TEMPLATES.length} templates qualify. The rest are two-column or decorated — better for a human, riskier for a parser.`,
    },
    {
      q: "Should I include a photo?",
      a: "In the Philippines, yes — it is expected, along with references and a declaration. For US, UK and Australian applications, remove all three; there they read as unprofessional or invite discrimination-law problems. Every one is a toggle.",
    },
    {
      q: "How do I get a PDF?",
      a: "Download PDF opens your browser's print dialog — choose Save as PDF, set margins to None, and tick Background graphics so the coloured panels are not dropped.",
    },
    {
      q: "Can I keep more than one resume?",
      a: "As many as you like. The usual pattern is one designed version and one ATS-safe version of the same content — duplicate it, switch the template, done.",
    },
  ];

  return (
    <section id="faq" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Questions</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {qs.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-800">
                {item.q}
                <span className="ml-4 shrink-0 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Your resume is one tab away.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
          No account, no email, no trial that expires. Open the editor, fill in the form, and export a
          PDF you would be happy to send.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/editor"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Build my resume
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            My saved resumes
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-slate-900 text-[10px] font-bold text-white">
            R
          </span>
          <span className="font-semibold text-slate-700">Resume Builder</span>
        </div>
        <p className="sm:ml-4">
          Built for the Philippine job market. Runs entirely in your browser — nothing is uploaded.
        </p>
        <nav className="flex gap-4 sm:ml-auto">
          <a href="#features" className="hover:text-slate-800">
            Features
          </a>
          <a href="#templates" className="hover:text-slate-800">
            Templates
          </a>
          <a href="#faq" className="hover:text-slate-800">
            FAQ
          </a>
          <Link href="/editor" className="font-medium text-slate-700 hover:text-slate-900">
            Open editor
          </Link>
        </nav>
      </div>
    </footer>
  );
}
