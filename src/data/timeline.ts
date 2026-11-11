/** Entries for the ship.log aside on the homepage, oldest first. */
export interface TimelineEntry {
  date: string;
  datetime?: string;
  text: string;
  href?: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    date: "2023",
    datetime: "2023-09",
    text: "DEUST — Maths, CS & Physics, FST Settat",
  },
  {
    date: "2025",
    datetime: "2025-09",
    text: "Licence ST — Computer Engineering",
  },
  {
    date: "2026.04",
    datetime: "2026-04",
    text: "PFE internship at Jobistart — OneBotAds",
  },
  {
    date: "2026.06",
    datetime: "2026-06-23",
    text: "onebotads.net deployed to production",
    href: "/projects/onebotads/",
  },
  {
    date: "2026.06",
    datetime: "2026-06-30",
    text: "full handoff delivered: code, docs, DB",
  },
  {
    date: "2026.09",
    datetime: "2026-09-14",
    text: "ten-project backend & DevOps sprint",
    href: "/projects/#infra",
  },
  {
    date: "2026.09",
    datetime: "2026-09-19",
    text: "ci-pulse, a multi-tenant CI status SaaS, feature-complete",
    href: "/projects/ci-pulse/",
  },
  {
    date: "2026.10",
    datetime: "2026-10-12",
    text: "ci-pulse security pass: a real RCE patched",
    href: "/log/ci-pulse-security-pass/",
  },
  {
    date: "2026.10",
    datetime: "2026-10-30",
    text: "Invoice MA, Proposal Maker and CeoJoe live",
    href: "/projects/#product",
  },
  {
    date: "2026.11",
    datetime: "2026-11-08",
    text: "Lantern Analytics: cookieless by schema, AWS Terraform",
    href: "/projects/lantern-analytics/",
  },
  {
    date: "2026.11",
    datetime: "2026-11-10",
    text: "Site Kit: 60 bilingual demo sites live",
    href: "/projects/site-kit/",
  },
  { date: "now", text: "open to backend and DevOps roles, remote or on-site" },
];
