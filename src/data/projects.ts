/**
 * The single source of truth for every project on the site.
 * Homepage, /projects/, and the CV all render from this file.
 *
 * Status is checked at build time (see `assertConsistent` at the bottom):
 * a project cannot claim "live" without a URL, "source" without a repo,
 * and "private" with either. The build fails instead of the site lying.
 */

export type Status =
  | "live" // public URL anyone can open
  | "released" // package or binary release, no hosted URL (CLIs, libraries)
  | "source" // code-complete on GitHub, not deployed anywhere
  | "private"; // no public repo and no URL

export type Group = "infra" | "backend" | "product" | "tooling";

export const GROUPS: {
  id: Group;
  eyebrow: string;
  title: string;
  lede: string;
}[] = [
  {
    id: "infra",
    eyebrow: "Infrastructure & DevOps",
    title: "Provisioning, pipelines, observability",
    lede: "Infrastructure as code, CI/CD, and monitoring. Each one tested without a cloud account, so the proof is in the repo, not a screenshot.",
  },
  {
    id: "backend",
    eyebrow: "Backend services & APIs",
    title: "Services that hold up under real traffic",
    lede: "Auth, rate limiting, real-time, scheduled work, and small developer APIs. Every one has a README, an .env.example and real tests.",
  },
  {
    id: "product",
    eyebrow: "Products",
    title: "Things a person can open and use",
    lede: "SaaS and local-business apps, most of them bilingual for the Moroccan market. The AI-agent builds are labelled as such.",
  },
  {
    id: "tooling",
    eyebrow: "Tooling & libraries",
    title: "CLIs, packages, kits",
    lede: "Small, finished tools. Two are released as installable packages.",
  },
];

export interface Project {
  id: string;
  name: string;
  /** One sentence, plain words. */
  tagline: string;
  group: Group;
  status: Status;
  /** YYYY-MM, used for sorting newest first. */
  date: string;
  /** Up to four tags. */
  stack: string[];
  repo?: string;
  url?: string;
  /** Internal route, e.g. "/projects/ci-pulse/". */
  caseStudy?: string;
  /** Internal route to a Ship Log post. */
  log?: string;
  /** "ai-agents" renders the "built with AI coding agents" label. */
  built: "me" | "ai-agents";
  /** Shown in the homepage "Also built" strip. */
  featured?: boolean;
  /** 1..n: appears in the CV's Projects section in that order. */
  cvRank?: number;
  /** Short note shown next to the status, when the status needs one. */
  note?: string;
}

const gh = (name: string) => `https://github.com/YoussefAyach01/${name}`;

export const PROJECTS: Project[] = [
  // ---------- Case studies ----------
  {
    id: "onebotads",
    name: "OneBotAds",
    tagline:
      "AI-powered ad automation across Meta, TikTok, Google, Snapchat, LinkedIn and Taboola, built from a click-through mockup to a live product in three months.",
    group: "product",
    status: "live",
    date: "2026-06",
    stack: ["Node.js / Express", "PostgreSQL", "React", "LLM agent"],
    url: "https://onebotads.net",
    caseStudy: "/projects/onebotads/",
    log: "/log/pfe-postmortem/",
    built: "me",
  },
  {
    id: "ci-pulse",
    name: "ci-pulse",
    tagline:
      "A hosted, multi-tenant CI status board: connect GitHub repos with OAuth, see every Actions run on one dashboard, get a Slack or Discord alert when a build turns red.",
    group: "product",
    status: "private",
    date: "2026-10",
    stack: ["Next.js", "Neon / Drizzle", "Auth.js", "Stripe"],
    caseStudy: "/projects/ci-pulse/",
    log: "/log/ci-pulse-security-pass/",
    built: "me",
    featured: true,
    cvRank: 1,
    note: "private build, demo on request",
  },
  {
    id: "site-kit",
    name: "Site Kit",
    tagline:
      "One small TypeScript engine that builds a complete website for a local business, in French and Arabic, from a single content file. Sixty demo sites are live, covered by 497 tests.",
    group: "product",
    status: "live",
    date: "2026-11",
    stack: [
      "TypeScript",
      "Static HTML & CSS",
      "French + Arabic (RTL)",
      "Vitest",
    ],
    url: "https://ayach.is-a.dev/site-kit/",
    repo: gh("site-kit"),
    caseStudy: "/projects/site-kit/",
    log: "/log/site-kit-arabic-review/",
    built: "ai-agents",
    featured: true,
    cvRank: 2,
  },
  {
    id: "lantern-analytics",
    name: "Lantern Analytics",
    tagline:
      "Cookieless web analytics with no IP, cookie or fingerprint column anywhere in the schema, plus an AWS Terraform module tested against a mocked provider.",
    group: "infra",
    status: "private",
    date: "2026-11",
    stack: ["Hono", "SQLite", "Terraform (AWS)", "Docker"],
    caseStudy: "/projects/lantern-analytics/",
    log: "/log/lantern-privacy-by-schema/",
    built: "ai-agents",
    featured: true,
    cvRank: 3,
    note: "repo coming; not applied to real AWS yet",
  },
  {
    id: "ceojoe",
    name: "CeoJoe",
    tagline:
      "The site for CeoJoe, my small web studio: services, pricing, and a showcase of all sixty Site Kit demos, presented as concept builds and not as client work.",
    group: "product",
    status: "live",
    date: "2026-10",
    stack: ["Astro", "GSAP", "Vercel"],
    url: "https://ceojoe.vercel.app",
    caseStudy: "/projects/ceojoe/",
    log: "/log/sixty-sites-one-afternoon-of-images/",
    built: "ai-agents",
  },

  // ---------- Sep 2026 sprint ----------
  {
    id: "deploy-pipeline",
    name: "deploy-pipeline",
    tagline:
      "Dockerized app + GitHub Actions CI/CD + Ansible playbook for provisioning a VPS from scratch: nginx, TLS, the works.",
    group: "infra",
    status: "source",
    date: "2026-09",
    stack: ["Docker", "Ansible", "GitHub Actions"],
    repo: gh("deploy-pipeline"),
    log: "/log/deploy-pipeline/",
    built: "me",
    note: "needs a VPS to run live",
  },
  {
    id: "observability-stack",
    name: "observability-stack",
    tagline:
      "Prometheus + Grafana, provisioned as code, scraping task-api-hardened's /metrics for live dashboards.",
    group: "infra",
    status: "source",
    date: "2026-09",
    stack: ["Prometheus", "Grafana", "Docker Compose"],
    repo: gh("observability-stack"),
    log: "/log/observability-stack/",
    built: "me",
  },
  {
    id: "do-vm-terraform",
    name: "do-vm-terraform",
    tagline:
      "A Terraform module provisioning a DigitalOcean droplet, firewall and DNS record, the declarative counterpart to deploy-pipeline's Ansible. Tested against a mocked provider in CI.",
    group: "infra",
    status: "source",
    date: "2026-09",
    stack: ["Terraform", "DigitalOcean"],
    repo: gh("do-vm-terraform"),
    log: "/log/do-vm-terraform/",
    built: "me",
    note: "never applied to a real account",
  },
  {
    id: "task-api-hardened",
    name: "task-api-hardened",
    tagline:
      "Fastify task API with Redis-backed rate limiting and caching, structured logging, cache invalidation on writes, and a Prometheus /metrics endpoint.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["Fastify", "Redis", "PostgreSQL"],
    repo: gh("task-api-hardened"),
    log: "/log/task-api-hardened/",
    built: "me",
  },
  {
    id: "auth-service",
    name: "auth-service",
    tagline:
      "JWT auth with refresh-token rotation and reuse detection, argon2id hashing, rate-limited login; each decision checked against the OWASP auth cheat sheet as I built it.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["JWT", "argon2id", "OWASP"],
    repo: gh("auth-service"),
    log: "/log/auth-service/",
    built: "me",
  },
  {
    id: "live-room",
    name: "live-room",
    tagline:
      "A real-time poll room: votes and presence sync instantly across every connected client over WebSockets.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["Socket.io", "Express"],
    repo: gh("live-room"),
    log: "/log/live-room/",
    built: "me",
  },
  {
    id: "weather-pulse",
    name: "weather-pulse",
    tagline:
      "A cron job collecting real weather data into Postgres, served through a zero-JS, server-rendered dashboard.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["node-cron", "PostgreSQL"],
    repo: gh("weather-pulse"),
    log: "/log/weather-pulse/",
    built: "me",
  },
  {
    id: "ci-status",
    name: "ci-status",
    tagline:
      "A Go CLI, my first Go project, that prints the latest GitHub Actions run across several repos and can poll until it finishes. Released as binaries for Linux, macOS and Windows.",
    group: "tooling",
    status: "released",
    date: "2026-09",
    stack: ["Go", "GitHub API"],
    repo: gh("ci-status"),
    url: "https://github.com/YoussefAyach01/ci-status/releases",
    log: "/log/ci-status/",
    built: "me",
  },
  {
    id: "strict-env",
    name: "strict-env",
    tagline:
      "A zero-dependency typed env-var validator, packaged as dual ESM/CJS. Not on the npm registry yet; installs from GitHub.",
    group: "tooling",
    status: "source",
    date: "2026-09",
    stack: ["TypeScript", "tsup"],
    repo: gh("strict-env"),
    log: "/log/strict-env/",
    built: "me",
  },
  {
    id: "termdle",
    name: "termdle",
    tagline:
      "A terminal Wordle clone, the deliberately just-for-fun slot. Installs and runs with one npx command straight from GitHub.",
    group: "tooling",
    status: "released",
    date: "2026-09",
    stack: ["TypeScript", "CLI"],
    repo: gh("termdle"),
    url: "https://github.com/YoussefAyach01/termdle#install",
    log: "/log/termdle/",
    built: "me",
  },

  // ---------- Oct–Nov 2026 products, built with AI coding agents ----------
  {
    id: "invoice-ma",
    name: "Invoice MA",
    tagline:
      "Invoice generator for Moroccan auto-entrepreneurs: French interface, amounts in dirhams, the mentions a Moroccan invoice is expected to carry, and PDF export through the browser.",
    group: "product",
    status: "live",
    date: "2026-10",
    stack: ["Next.js", "React"],
    url: "https://invoice-ma.vercel.app",
    repo: gh("invoice-ma"),
    built: "ai-agents",
  },
  {
    id: "proposal-maker",
    name: "Proposal Maker",
    tagline:
      "A tool for freelancers to write client proposals and quotes, preview them live, and export to PDF. No account: everything stays in the browser.",
    group: "product",
    status: "live",
    date: "2026-10",
    stack: ["Next.js", "localStorage"],
    url: "https://proposal-maker-phi.vercel.app",
    repo: gh("proposal-maker"),
    built: "ai-agents",
  },
  {
    id: "qr-menu",
    name: "qr-menu",
    tagline:
      "QR-code menu for restaurants and cafés. Diners order from their phone and the order goes to the restaurant's WhatsApp.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("qr-menu"),
    built: "ai-agents",
  },
  {
    id: "booking-page",
    name: "booking-page",
    tagline:
      "Appointment booking for a salon: pick a service, a day and a free slot, then confirm by WhatsApp.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("booking-page"),
    built: "ai-agents",
  },
  {
    id: "whatsapp-catalog",
    name: "whatsapp-catalog",
    tagline:
      "Product catalogue for small shops, in French and Arabic, with orders sent to the shop's WhatsApp.",
    group: "product",
    status: "source",
    date: "2026-10",
    stack: ["Next.js", "SQLite"],
    repo: gh("whatsapp-catalog"),
    built: "ai-agents",
  },
  {
    id: "link-in-bio",
    name: "link-in-bio",
    tagline: "One public page of links per creator.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("link-in-bio"),
    built: "ai-agents",
  },
  {
    id: "waitlist-kit",
    name: "waitlist-kit",
    tagline:
      "Embeddable waitlist with a referral queue: leave an e-mail, get a rank and an invite link.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("waitlist-kit"),
    built: "ai-agents",
  },
  {
    id: "feedback-widget",
    name: "feedback-widget",
    tagline: "Embeddable feedback button plus a public roadmap with votes.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("feedback-widget"),
    built: "ai-agents",
  },
  {
    id: "changelog-saas",
    name: "changelog-saas",
    tagline: "Hosted changelog with an embeddable “What’s new” widget.",
    group: "product",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("changelog-saas"),
    built: "ai-agents",
  },
  {
    id: "review-collector",
    name: "review-collector",
    tagline:
      "Review-request links and QR codes: happy customers go to the Google review page, unhappy ones to a private feedback form.",
    group: "product",
    status: "source",
    date: "2026-10",
    stack: ["Next.js", "SQLite"],
    repo: gh("review-collector"),
    built: "ai-agents",
  },
  {
    id: "form-backend",
    name: "form-backend",
    tagline:
      "A form endpoint in the style of Formspree: point any HTML form at it and it stores the submissions.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["Next.js", "SQLite"],
    repo: gh("form-backend"),
    built: "ai-agents",
  },
  {
    id: "og-image-api",
    name: "og-image-api",
    tagline:
      "Social preview images on demand: one GET request returns a 1200×630 PNG. API keys and usage metering included.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["Hono", "SQLite"],
    repo: gh("og-image-api"),
    built: "ai-agents",
  },
  {
    id: "webhook-inbox",
    name: "webhook-inbox",
    tagline:
      "Get a unique URL, point any webhook at it, and inspect what arrives.",
    group: "backend",
    status: "source",
    date: "2026-10",
    stack: ["Hono", "SQLite"],
    repo: gh("webhook-inbox"),
    built: "ai-agents",
  },
  {
    id: "mock-api",
    name: "mock-api",
    tagline:
      "Describe a resource as a JSON Schema and get a working CRUD endpoint.",
    group: "backend",
    status: "source",
    date: "2026-10",
    stack: ["Hono", "SQLite"],
    repo: gh("mock-api"),
    built: "ai-agents",
  },
  {
    id: "sheet-api",
    name: "sheet-api",
    tagline: "Upload a CSV and get a read-only JSON API over its rows.",
    group: "backend",
    status: "source",
    date: "2026-10",
    stack: ["Hono", "SQLite"],
    repo: gh("sheet-api"),
    built: "ai-agents",
  },
  {
    id: "status-page",
    name: "status-page",
    tagline:
      "Uptime monitoring with a public status page. Opens an incident after two failed checks in a row.",
    group: "backend",
    status: "source",
    date: "2026-09",
    stack: ["Hono", "SQLite"],
    repo: gh("status-page"),
    built: "ai-agents",
  },
  {
    id: "cron-hooks",
    name: "cron-hooks",
    tagline:
      "Scheduled webhooks as a service, built on pg-jobq: register a URL and a cron expression, get called on time with retries.",
    group: "backend",
    status: "private",
    date: "2026-10",
    stack: ["Hono", "PostgreSQL", "pg-jobq"],
    built: "ai-agents",
    note: "no public repo yet",
  },
  {
    id: "pg-jobq",
    name: "pg-jobq",
    tagline:
      "A small Postgres-backed job queue for Node: SKIP LOCKED claiming, leases, retries with backoff.",
    group: "tooling",
    status: "source",
    date: "2026-09",
    stack: ["PostgreSQL", "TypeScript"],
    repo: gh("pg-jobq"),
    built: "ai-agents",
  },
  {
    id: "agency-kit",
    name: "agency-kit",
    tagline:
      "A sales toolkit for selling Site Kit websites to local businesses: pricing, outreach templates in French and Arabic, proposal and contract templates. Documents, not software.",
    group: "tooling",
    status: "source",
    date: "2026-10",
    stack: ["Documents", "FR + AR"],
    repo: gh("agency-kit"),
    built: "ai-agents",
  },
];

// ---------- Queries ----------

const byDateDesc = (a: Project, b: Project) => b.date.localeCompare(a.date);

export const byGroup = (g: Group): Project[] =>
  PROJECTS.filter((p) => p.group === g).sort(byDateDesc);

export const featured = (): Project[] =>
  PROJECTS.filter((p) => p.featured).sort(byDateDesc);

export const caseStudies = (): Project[] => PROJECTS.filter((p) => p.caseStudy);

export const forCv = (): Project[] =>
  PROJECTS.filter((p) => p.cvRank !== undefined).sort(
    (a, b) => a.cvRank! - b.cvRank!,
  );

export const counts = () => ({
  total: PROJECTS.length,
  live: PROJECTS.filter((p) => p.status === "live").length,
  released: PROJECTS.filter((p) => p.status === "released").length,
});

// ---------- Build-time consistency check ----------

function assertConsistent(list: Project[]): void {
  const ids = new Set<string>();
  for (const p of list) {
    if (ids.has(p.id)) throw new Error(`projects.ts: duplicate id "${p.id}"`);
    ids.add(p.id);
    const fail = (why: string) => {
      throw new Error(`projects.ts: "${p.id}" is ${p.status} but ${why}`);
    };
    if (p.status === "live" && !p.url) fail("has no url");
    if (p.status === "released" && !p.url) fail("has no release url");
    if (p.status === "source" && !p.repo) fail("has no repo");
    if (p.status === "private" && (p.repo || p.url))
      fail("has a public repo or url");
    if (p.stack.length > 4) fail("has more than four stack tags");
  }
}

assertConsistent(PROJECTS);
