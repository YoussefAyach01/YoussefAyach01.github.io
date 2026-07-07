# Portfolio — Ayach Youssef

Personal portfolio: hub page plus one case-study page per shipped project.
Static HTML/CSS/JS — no build step, no framework, nothing to maintain.

## Run

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Structure

- `index.html` — the hub: hero + ship log, featured OneBotAds, earlier work, skills, education, contact
- `projects/onebotads.html` — OneBotAds case study (the "presentation" page)
- `styles.css` — shared design system (warm monochrome editorial)
- `assets/img/` — optimized WebP screenshots; `assets/Ayach_Youssef_CV.pdf`

Adding a project: create `projects/<name>.html` (copy onebotads.html as the skeleton),
add a card in the hub's work section.

## Deploy

GitHub Pages. Recommended: push to a repo named `YoussefAyach01.github.io`
(serves at the root URL), Settings → Pages → deploy from `main` branch root.

No environment variables — see `.env.example`.
