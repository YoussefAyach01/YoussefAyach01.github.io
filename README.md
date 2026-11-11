# ayach.is-a.dev — career platform

Portfolio, project case studies, Ship Log (blog), and live CV of Ayach Youssef.
Astro (TypeScript strict), static output, zero client JS except a scroll-reveal
observer and GoatCounter analytics.

## Run

```
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run check      # astro type check
npm run lint       # prettier check
```

## Structure

- `src/pages/` — `/` hub · `/projects/` + case studies · `/log/` Ship Log · `/cv/` (print = 1-page PDF) · 404
- `src/content/log/*.md` — blog posts (title/description/date/tags/draft frontmatter)
- `src/data/projects.ts` — every project, with status/group/links; `/projects/`, the
  homepage and the CV all render from it. `skills.ts` and `timeline.ts` likewise.
- `src/components/` — `ProjectCard`, `ProjectRow`, `StatusBadge`, `ShipLog`, `Window`
- `src/layouts/` — `Base.astro` (chrome + meta), `Post.astro` (log entries)
- `src/styles/global.css` — the design system (warm monochrome editorial)

**New blog post** = drop a `.md` in `src/content/log/`. **New project** = add an
entry to `src/data/projects.ts` (optionally a case study page under
`src/pages/projects/` and `caseStudy: "/projects/<id>/"`). The build fails if a
status is inconsistent with its links (`live` needs `url`, `source` needs `repo`,
`private` has neither). **A project goes live** = change `status` and add `url`.

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages
(`.github/workflows/deploy.yml`). Custom domain `ayach.is-a.dev` via
[is-a-dev/register](https://github.com/is-a-dev/register) CNAME → `youssefayach01.github.io`.

No environment variables (see `.env.example`). GitHub Pages can't set custom HTTP
headers; if stricter security headers are ever needed, move hosting to Cloudflare
Pages (`_headers` support) without changing the build.
