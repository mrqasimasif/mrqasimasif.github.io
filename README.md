# Muhammad Qasim — Portfolio

> Live at **https://mrqasimasif.github.io/**

A vCard-style personal site: a fixed profile sidebar next to a tabbed content pane.
Hand-written HTML, CSS and JavaScript — no framework, no build step, no runtime
dependencies. Push to `master` and GitHub Pages serves it.

## Structure

```
┌─────────────┬────────────────────────────────────────┐
│             │  About · Resume · Portfolio · Contact  │  ← pill navbar
│  Sidebar    │  · Gallery · ☀                         │    (bottom bar on mobile)
│             ├────────────────────────────────────────┤
│  avatar     │                                        │
│  name       │  the active <article data-page="…">    │
│  title      │                                        │
│  ─────      │                                        │
│  contacts   │                                        │
│  ─────      │                                        │
│  socials    │                                        │
└─────────────┴────────────────────────────────────────┘
```

Five pages, each an `<article data-page="…">`. Only one is `.active` at a time —
switching is a class swap, so there is no page load between tabs.

| Page | Contains |
|---|---|
| **About** | Intro, *Highlights & Successes* stat cards, *Featured Work* cards |
| **Resume** | Experience, Research, Education and Certifications timelines, plus skill bars |
| **Portfolio** | Category filter (chips on desktop, dropdown on mobile) + project grid |
| **Contact** | Map, contact detail cards, contact form |
| **Gallery** | Photo carousel with arrow-key navigation |

## Features

- **Deep links** — `/#resume`, `/#portfolio` etc. open the right tab directly
- **Light / dark theme** — follows the system preference, remembers your choice, no flash on load
- **Live GitHub data** — star counts and languages fetched from the GitHub API, cached 6 hours
- **Collapsible sidebar** on narrow screens via *Show Contacts*
- **Animated skill bars** that fill when the Resume tab opens
- **Cursor pet** — a small cat trots after the pointer, faces its direction of travel,
  tracks you with its eyes and curls up for a nap after four idle seconds. Its
  rAF loop stops once it catches up, so it costs nothing while you read. Hidden
  entirely on touch devices and under `prefers-reduced-motion`
- SEO: Open Graph + Twitter cards, `Person` JSON-LD, `sitemap.xml`, `robots.txt`, custom `404.html`
- Accessibility: skip link, semantic landmarks, `aria-expanded` on toggles, visible focus rings,
  `prefers-reduced-motion` respected
- `<noscript>` fallback stacks every page so the site still reads with JavaScript off
- Print stylesheet — prints all five pages as a document

## Mobile

Verified at 320 / 360 / 375 / 414 / 768 / 1024 / 1280 / 1440 px and in landscape,
in both themes, with no horizontal overflow on any page.

- **Bottom tab bar** on phones, moving to a top-right pill bar at 1024px. It is
  `flex-wrap: nowrap` on purpose — if it ever wrapped to two rows it would cover
  content that the page's bottom margin was sized to clear. Below 375px the labels
  tighten so all five tabs still fit without scrolling.
- **44px minimum touch targets** on every control — nav tabs, social icons, the
  sidebar toggle, filter options and the copy button. Icons stay visually small;
  only the hit area grows.
- **16px form inputs**, because anything smaller makes iOS Safari zoom the page on
  focus and never zoom back out.
- **Safe-area insets** (`env(safe-area-inset-bottom)`) so the tab bar clears the
  home indicator on notched iPhones.
- **Sidebar height is measured, not hard-coded** — JS sets it from the real content
  height, capped at 80% of the viewport with internal scrolling beyond that, so it
  cannot clip in landscape or when you add a contact row.
- **Swipe** left/right on the gallery; arrow keys on desktop.
- Compact project tiles on phones, so the one-column list stays scannable.
- Tap-highlight suppressed, `overscroll-behavior` set, `100svh` instead of `100vh`.

## Files

```
index.html          all five pages + an inline SVG icon sprite
404.html            styled not-found page
favicon.svg         gradient monogram
assets/
  css/style.css     design tokens, components, five breakpoints
  js/main.js        tabs, sidebar, filters, form, gallery, GitHub fetch
  img/              portrait, school logos, certification badges, skill icons
  files/            résumé PDF
robots.txt  sitemap.xml  site.webmanifest
```

## Local development

No tooling required — open `index.html` directly, or serve it so the fonts and
GitHub fetch behave as they do in production:

```bash
python -m http.server 8000
```

## Editing content

**Add a project** — copy a `<li class="project-item">` block in the Portfolio
article and set:

- `data-category` — must match one of the filter labels, lowercased (`ai & llms`,
  `computer vision`, `machine learning`, `web & systems`)
- `data-repo` — the GitHub repository name, if you want live stars and language

**Add gallery photos** — drop files into `assets/img/gallery/`, then list them in
the `GALLERY` array at the top of `assets/js/main.js`:

```js
var GALLERY = [
  { src: "assets/img/gallery/campus.jpg", title: "Lexington", text: "Autumn on campus" },
];
```

**Wire up the contact form** — GitHub Pages is static, so the form needs an
external endpoint. Create one at [formspree.io](https://formspree.io) and replace
`YOUR_FORM_ID` in the form's `action`. Until then the submit button falls back to
opening the visitor's mail client.

**Theme** — colours, spacing and the type scale are CSS custom properties at the
top of `assets/css/style.css`. Change `--accent` and the whole site follows.

## Deployment

Push to `master`. GitHub Pages picks it up. The repository must be public
(or on a plan that allows Pages on private repos).

## Credits

Layout follows the [vCard personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio)
pattern by codewithsadee (MIT), rebuilt from scratch here. Skill and certification
logos from [SeekLogo](https://seeklogo.com/), [VectorLogoZone](https://www.vectorlogo.zone/)
and [SVG Repo](https://www.svgrepo.com/). Icons hand-inlined in the
[Lucide](https://lucide.dev/) style.
