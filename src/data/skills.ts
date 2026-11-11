/**
 * Skill groups, rendered on the homepage (full) and the CV (compact).
 * `tone` picks the tag colour class on the homepage.
 */
export interface SkillGroup {
  title: string;
  tone: "yellow" | "blue" | "green" | "red";
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    title: "Infrastructure & DevOps",
    tone: "yellow",
    items: [
      "Linux / Ubuntu",
      "Docker",
      "Ansible",
      "Terraform (DigitalOcean, AWS)",
      "nginx",
      "PM2",
      "GitHub Actions (CI/CD)",
      "Prometheus / Grafana",
      "Vercel / GitHub Pages",
      "DNS / DHCP / VLAN",
    ],
  },
  {
    title: "Languages",
    tone: "blue",
    items: [
      "JavaScript / TypeScript",
      "Go",
      "Python",
      "Java",
      "C",
      "PHP",
      "SQL / PL-SQL",
      "Bash",
    ],
  },
  {
    title: "Web & backend",
    tone: "green",
    items: [
      "Node.js / Express / Fastify / Hono",
      "Next.js (App Router)",
      "React",
      "Astro",
      "Socket.io / WebSockets",
      "REST APIs",
      "JWT / OAuth 2.0 / Auth.js",
      "Stripe",
    ],
  },
  {
    title: "Data & tools",
    tone: "red",
    items: [
      "PostgreSQL (Sequelize, Drizzle, Neon)",
      "Redis",
      "SQLite",
      "Oracle",
      "Git",
      "MCP servers / LLM agents",
      "AI coding agents (direction & review)",
    ],
  },
];

/** One line per group, for the CV. */
export const skillsCompact = () =>
  SKILLS.map((g) => ({ title: g.title, text: g.items.join(", ") }));
