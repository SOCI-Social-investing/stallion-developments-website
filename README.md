# Stallion Developments website

Static marketing site built with [Astro](https://astro.build). Every page is plain HTML at build time. The motion is GSAP, ScrollTrigger and Lenis, loaded only on the pages that use it.

```sh
npm install
npm run dev       # http://localhost:8014/stallion-developments-website/
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

Pushing to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/pages.yml`).

## Where things live

| Path | What |
| --- | --- |
| `src/pages/` | One `.astro` file per page. The URLs match the folders (`communities/maple-place-bracebridge/`). |
| `src/layouts/Layout.astro` | Shared head tags (title, description, canonical, OG, Organization JSON-LD), header, footer and site scripts. Pages pass `title`, `description`, `path` and an optional `schema` list. |
| `src/components/Header.astro`, `Footer.astro` | Nav and footer. The current page comes from the layout's `current` prop. |
| `src/components/motion/ScrollFilm.astro` | The home hero: a full-viewport, scroll-scrubbed frame film with text beats. Its usage notes are at the top of the file. |
| `src/components/motion/ScrollScrub.astro` | A smaller canvas scrubber for inner-page heroes (the Maple Place seasons card). |
| `src/data/home-film.ts` | The home film's frame sources, timeline, overlay and marquee. The `data-seg` values in `src/pages/index.astro` refer to its segment ids. |
| `src/styles/style.css` | Site styles. The film's mechanics CSS lives in `ScrollFilm.astro`. |
| `src/scripts/site.js` | Mobile nav, reveal on scroll, counters, forms, contact prefill, community filters. |
| `public/js/config.js` | Formspree endpoint and reCAPTCHA site key. |
| `public/frames/`, `public/assets/` | Film frames, images and loops, served as-is. |
| `tools/` | Frame generation (`kie.py`, `frames.sh`, `synth.py`) and QA scripts (`shoot.mjs`, `fullpage.mjs`, `formtest.mjs`, `videocheck.mjs`), which run against the dev or preview server. |

## Moving to the custom domain

In `astro.config.mjs`, set `base: "/"` (and `site` to the domain). Nothing else changes: the layout links and the component asset paths are built from `base`, and page content uses relative links.
