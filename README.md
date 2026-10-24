# Melvin Jessan — Portfolio

Personal portfolio site for Melvin Jessan, a pre-final-year B.E. Computer Science and Engineering (AI & ML) student at KIT, Coimbatore.

**Live:** https://mj-portfolio-three-pi.vercel.app/

## What's in it

- **Hero** — cut-out portrait over a ghost wordmark, with the name and availability card.
- **About** — short intro plus live count-up stats.
- **Work** — eight end-to-end projects, from AI/ML systems to full-stack apps.
- **Journey** — experience and education timeline.
- **Stack** — languages, frameworks, databases and AI tooling.
- **Milestones** — competitive programming profiles (LeetCode, CodeChef, Codeforces) with a link to the always-current stats on [Codolio](https://codolio.com/profile/mj004).
- **Contact** — email, GitHub, LinkedIn and phone.

The competitive programming numbers in the Milestones cards are maintained by hand; the Codolio link is the source of truth for current ratings and solved counts.

## Tech

Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies to install.

- **Animation:** GSAP, ScrollTrigger and Lenis, vendored in `vendor/`
- **Fonts:** self-hosted WOFF2 in `fonts/` (Anton, Bebas Neue, Instrument Serif, Space Grotesk — all SIL Open Font License)
- **Hosting:** Vercel, deploying automatically on every push to `main`

```
index.html        markup for all sections
css/style.css     layout, typography, responsive rules
css/fonts.css     @font-face declarations
js/main.js        preloader, custom cursor, scroll reveals, count-ups, menu
vendor/           GSAP, ScrollTrigger, Lenis
assets/           portrait images and résumé PDF
fonts/            self-hosted WOFF2 files
```

## Run locally

Any static server works:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Push to `main`. Vercel builds and deploys the site automatically; there is nothing to configure beyond the repository connection.

## Contact

- GitHub — [melvin93-glich](https://github.com/melvin93-glich)
- LinkedIn — [melvin-jessan](https://www.linkedin.com/in/melvin-jessan/)
- Codolio — [mj004](https://codolio.com/profile/mj004)
- Email — kit28.24bam041@gmail.com
