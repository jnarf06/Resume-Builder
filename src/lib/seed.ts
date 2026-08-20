import type { Resume } from "./types";

/**
 * Demo content shown on first run so the templates have something to render.
 * Deliberately written as a *good* resume — every bullet carries a number — so
 * it doubles as a worked example of what the Check tab is asking for.
 *
 * "Juan Dela Cruz" and the example.com address are also entries in the
 * placeholder list in audit.ts, so a resume still carrying them gets flagged
 * rather than accidentally sent out.
 */
export const SAMPLE: Resume = {
  id: "sample",
  docName: "Sample resume",
  updatedAt: 0,
  settings: {
    template: "ortigas",
    accent: "",
    showPhoto: true,
    showDeclaration: true,
    showReferences: true,
    hideReferenceContacts: true,
    showSignature: false,
    fontScale: 1,
  },
  basics: {
    fullName: "Juan Dela Cruz",
    title: "Digital Marketing Manager",
    phone: "+63 917 000 0000",
    email: "juan.delacruz@example.com",
    location: "Quezon City, Metro Manila",
    website: "linkedin.com/in/juandelacruz",
    photo: "",
    summary:
      "Digital marketing manager with 8 years in paid search and SEO for e-commerce and travel brands. Manages ₱40M in annual ad spend across Google, Meta and programmatic channels, and leads a team of six specialists. Cut blended CPA by 34% in 2024 while growing attributed revenue 61% year on year. Comfortable owning the number, not just the campaign.",
  },
  skills: [
    "Paid Search (Google Ads) | 5",
    "Paid Social (Meta, TikTok) | 4",
    "SEO — Technical & On-Page | 5",
    "Conversion Rate Optimization | 4",
    "Google Analytics 4 | 5",
    "Google Tag Manager | 4",
    "Looker Studio | 4",
    "SQL | 3",
    "Budget Forecasting | 5",
    "A/B Testing | 4",
    "Team Leadership | 4",
    "Stakeholder Reporting | 5",
  ],
  experience: [
    {
      id: "x1",
      company: "Northwind Retail Group",
      role: "Digital Marketing Manager",
      start: "Mar 2021",
      end: "Present",
      employment: "Full-time",
      bullets: [
        "Own a ₱40M annual paid media budget across Google, Meta and programmatic, reporting performance weekly to the CMO.",
        "Cut blended CPA 34% and grew attributed revenue 61% YoY by restructuring 200+ campaigns around margin rather than volume.",
        "Built a Looker Studio reporting stack that replaced 12 hours of manual weekly reporting across three markets.",
        "Lead and coach a team of 6 specialists; promoted 2 to senior roles within 18 months.",
        "Ran a 9-month landing page testing programme that lifted checkout conversion from 1.8% to 2.9%.",
      ],
    },
    {
      id: "x2",
      company: "Bluewater Travel",
      role: "Senior SEM Specialist",
      start: "Jun 2018",
      end: "Feb 2021",
      employment: "Full-time",
      bullets: [
        "Scaled hotel search campaigns from ₱2M to ₱11M in monthly spend while holding ROAS above 6.0.",
        "Launched Performance Max across 4 markets, contributing 23% of total bookings within two quarters.",
        "Reduced wasted spend 18% through a negative keyword and search term audit process run fortnightly.",
      ],
    },
    {
      id: "x3",
      company: "Craft & Co. Digital",
      role: "SEO Specialist",
      start: "Jan 2017",
      end: "May 2018",
      employment: "Full-time",
      bullets: [
        "Grew organic sessions 140% in 12 months for a 3,000-page e-commerce catalogue.",
        "Fixed crawl and indexation issues that were hiding 40% of product pages from Google.",
        "Produced monthly performance reports for 8 client accounts.",
      ],
    },
  ],
  education: [
    {
      id: "xe1",
      school: "University of the Philippines",
      course: "BS Business Administration, Marketing",
      level: "Tertiary",
      year: "2016",
    },
  ],
  languages: [
    { id: "xl1", name: "English", level: "Fluent" },
    { id: "xl2", name: "Filipino", level: "Native" },
  ],
  references: [
    {
      id: "xr1",
      name: "Maria Santos",
      role: "Chief Marketing Officer",
      company: "Northwind Retail Group",
      phone: "",
      email: "",
    },
  ],
  declaration:
    "I hereby declare that all the information provided is true, accurate, and complete to the best of my knowledge.",
};

/** What "New" produces: nothing but the format settings. */
export const BLANK: Resume = {
  id: "blank",
  docName: "Untitled resume",
  updatedAt: 0,
  settings: { ...SAMPLE.settings, hideReferenceContacts: false },
  basics: {
    fullName: "",
    title: "",
    phone: "",
    email: "",
    location: "",
    website: "",
    photo: "",
    summary: "",
  },
  skills: [],
  experience: [
    { id: "b1", company: "", role: "", start: "", end: "", employment: "", bullets: [""] },
  ],
  education: [{ id: "b2", school: "", course: "", level: "Tertiary", year: "" }],
  languages: [],
  references: [],
  declaration: SAMPLE.declaration,
};

/** Placeholder copy shown in empty form fields, kept in one place. */
export const HINTS = {
  fullName: "Juan Dela Cruz",
  title: "Digital Marketing Manager",
  phone: "+63 917 000 0000",
  email: "you@example.com",
  location: "Quezon City, Metro Manila",
  website: "linkedin.com/in/yourname",
  summary:
    "Three to five sentences: what you do, how senior you are, the industries you know, and your single strongest result — with the number in it.",
  company: "Company name",
  role: "Your job title",
  start: "Jan 2021",
  end: "Present",
  bullets:
    "One achievement per line. Start with a verb and include a number:\nCut blended CPA 34% while growing revenue 61% YoY.\nManaged a ₱40M annual budget across 4 markets.",
  skills: "One skill per line\nGoogle Ads\nSEO — Technical & On-Page\nGoogle Analytics 4",
  school: "University name",
  course: "BS Business Administration, Marketing",
  level: "Tertiary",
  year: "2016",
  language: "English",
  languageLevel: "Fluent",
  refName: "Maria Santos",
  refRole: "Chief Marketing Officer",
  refCompany: "Company name",
  refPhone: "+63 917 000 0000",
  refEmail: "maria@example.com",
} as const;

/**
 * Content used only for template thumbnails. Deliberately short and dense —
 * long bullets turn into illegible grey mush at a 200px preview width, and the
 * point of the gallery is to show the *shape* of each design.
 *
 * The gallery previews this rather than the user's own resume: a new resume is
 * empty, and an empty page renders every template as an identical blank sheet.
 */
export const MOCK: Resume = {
  id: "mock",
  docName: "Preview",
  updatedAt: 0,
  settings: {
    template: "ortigas",
    accent: "",
    showPhoto: true,
    showDeclaration: false,
    showReferences: true,
    hideReferenceContacts: true,
    showSignature: false,
    fontScale: 1,
  },
  basics: {
    fullName: "Maria Reyes",
    title: "Operations Manager",
    phone: "+63 917 555 0123",
    email: "maria.reyes@example.com",
    location: "Makati City",
    website: "linkedin.com/in/mariareyes",
    photo: "",
    summary:
      "Operations manager with 9 years in service delivery and team leadership. Runs a 45-person department across two sites, cut average handling time 22% and lifted CSAT from 82% to 91% in two years.",
  },
  skills: [
    "Team Leadership | 5",
    "Process Improvement | 5",
    "Workforce Planning | 4",
    "Client Reporting | 4",
    "Quality Assurance | 4",
    "Excel & Power BI | 4",
    "Budget Management | 3",
    "Training & Coaching | 5",
  ],
  experience: [
    {
      id: "m1",
      company: "Meridian Services",
      role: "Operations Manager",
      start: "Mar 2021",
      end: "Present",
      employment: "Full-time",
      bullets: [
        "Lead a 45-person department across two sites.",
        "Cut average handling time 22% through workflow redesign.",
        "Lifted CSAT from 82% to 91% in eight quarters.",
      ],
    },
    {
      id: "m2",
      company: "Crestline Group",
      role: "Team Leader",
      start: "Jun 2018",
      end: "Feb 2021",
      employment: "Full-time",
      bullets: [
        "Managed 12 associates against weekly service targets.",
        "Built the QA scorecard still used company-wide.",
      ],
    },
    {
      id: "m3",
      company: "Vantage Solutions",
      role: "Senior Associate",
      start: "Jan 2016",
      end: "May 2018",
      employment: "Full-time",
      bullets: [
        "Handled escalations for three enterprise accounts.",
        "Trained 20 new hires across four intakes.",
      ],
    },
  ],
  education: [
    {
      id: "me1",
      school: "De La Salle University",
      course: "BS Business Management",
      level: "Tertiary",
      year: "2015",
    },
  ],
  languages: [
    { id: "ml1", name: "English", level: "Fluent" },
    { id: "ml2", name: "Filipino", level: "Native" },
  ],
  references: [
    { id: "mr1", name: "Carlos Lim", role: "Director of Operations", company: "Meridian", phone: "", email: "" },
  ],
  declaration: SAMPLE.declaration,
};
