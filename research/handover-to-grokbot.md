# Handover brief — remarkablemensballet.co.nz

**For:** Grokbot (incoming AI collaborator)
**Prepared by:** Claude (Opus 4.7, 1M context)
**Project owner:** Spike (Uan Spijkerbosch — spike@hq.net.nz)
**Date:** 2026-10-14

---

## 60-second summary

A website for the **Remarkable Men's Ballet** — a Queenstown Christmas Show tradition (founded 2006 by Doug Kamo + Simon Green). **Christmas 2026 = 20th anniversary**, which is the de facto target launch window.

Full-featured Kirby CMS site, locally working. 34 team bios, 9 photo albums (178+ photos), 16 press articles, 3 embedded YouTube videos, working admin panel, lightbox gallery with slideshow, submit-a-memory form. Not yet deployed. Not yet pushed to a git remote.

Spike's the project owner **and a performer in the troupe** (stage name: "Balletman") — he's been feeding bios and context session-by-session as he collects it from his contacts.

---

## Stack

| Component | Choice | Reason |
|---|---|---|
| CMS | **Kirby 4** (flat-file PHP) | Target host is affordabledomains.co.nz shared hosting — no MySQL. Developer recommended Kirby. |
| PHP | 8.1 (host) / 8.3 (local Laragon) | Kirby 4 needs 8.1+ |
| Panel admin | Kirby's built-in Panel | Works for Spike's 2–3 editor crew |
| Local dev | Laragon on Windows, serves repo via directory junction at `D:\laragon\www\remarkablemensballet` → `D:\Git\remarkablementsballet`. URL: `remarkablemensballet.test` |
| Production target | affordabledomains.co.nz (NZ host, LiteSpeed + PHP 8.1 + cPanel) | Spike's existing reseller |
| Licensing | Kirby requires a licence (~€99/site). Not purchased yet. |

**No MySQL. No Node. No Replit.** The project was migrated off Replit at session start; `/legacy/` holds the old React/Express/Postgres app as reference only.

---

## Repo layout

```
D:\Git\remarkablementsballet\
├── content/                # All editable content (flat files)
│   ├── 1_home/             # Homepage + hero image
│   ├── 2_about/
│   ├── 3_team/             # 34 performer / choreographer profiles
│   ├── 4_gallery/          # 9 event-based albums, 178+ photos
│   ├── 5_videos/           # 3 YouTube embeds (2014, 2019, 2020)
│   ├── 6_performances/
│   ├── 7_press/            # 16 ODT + LWB articles
│   ├── 8_timeline/
│   ├── 9_sponsors/
│   ├── 10_contact/
│   └── 11_submit-memory/   # Public submission form + draft moderation
├── site/
│   ├── blueprints/         # Content schema (Kirby YAML)
│   ├── templates/          # PHP templates
│   ├── snippets/           # Header, footer, lightbox, cards
│   ├── controllers/        # Form handling (memory submissions)
│   ├── plugins/rmb/        # Site-specific helpers
│   └── config/config.php
├── assets/css/main.css     # Base theme (midnight/magenta/gold palette)
├── assets/js/main.js       # Mobile nav + lightbox
├── scripts/                # Re-runnable PHP seeders (see below)
├── research/               # Dossier + guides (not served, for admins)
├── legacy/                 # Old Replit app, reference only
├── kirby/                  # Composer-installed Kirby core (gitignored)
├── vendor/                 # Composer deps (gitignored)
├── composer.json
├── index.php
└── .htaccess               # Apache/LiteSpeed rewrites
```

---

## Scripts you'll actually use

All idempotent. All at `scripts/`:

| Script | What | When to run |
|---|---|---|
| `seed-team.php` | Rewrites all 34 team member `person.txt` files from an inline array. Handles renames + prefix reordering. | Any time Spike feeds new names/bios. Edit the `$people` array near the top. |
| `seed-press.php` | Same but for press articles — currently 16. | Any time new press is pulled in. |
| `import-photos.php` | Walks a source folder, groups by EXIF date, routes photos into event albums (Christmas Show YYYY / Arrowtown Autumn Festival YYYY / Queenstown Winter Festival YYYY / other-dated). `--max-side=N` for resize-on-import. `--dry-run` works. | When Spike dumps new photos into `D:\temp\Mens Ballet\`. |
| `download-christmasshow.php` | Bulk-fetches photos from christmasshow.co.nz year pages using URL lists in `scripts/data/`. | Only needed to re-pull from source. All already imported. |
| `resize-gallery.php` | In-place JPEG resize of `/content/4_gallery` to `--max-side=2400 --jpeg-quality=85`. Destructive but matches the "no print quality needed" directive. Already run once (gallery: 840 MB → 356 MB). | After bulk imports if photos are print-master size. |
| `consolidate-albums.php` | One-off that collapsed date-grouped albums into event albums. Done; keep as reference. | Shouldn't need to re-run. |

Run with Laragon's PHP: `D:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe scripts/<name>.php`

---

## Content model highlights

### Team (34 profiles)

**Confirmed performers:**
- **Founders:** Doug Kamo, Simon Green
- **Current lead:** Craig "Ferg" Ferguson
- **Mayors (3):** Glyn Lewers (2022–25), Clive Geddes (2009), Peter Laurenson (married to former mayor Vanessa van Uden)
- **Recent additions:** Jake Neaves (volunteer firefighter), Pete Laurenson, Mark Taylor (builder, Jennian Homes), Nigel Kerr (Coronet Peak Ski Area Manager), David Kennedy (former Destination Queenstown CEO), Spike himself ("Balletman"), Jim Curry, Shaun Drader (QPD)
- **Established community figures:** Bert Haines (Future Hospitality Group), "Tall Paul" van der Kaag (Dutch-Australian 6'5" adventurer, rafting guide → paragliding founder → screen-printing business)
- **2011 cohort** (confirmed via James Beech's ODT first-person column): James Beech, Graeme Jackson, Tony Moore, Simon Thew, Henry Youngman, Irik Anderson, Darren Craig, JD Marrable, Chris Dagg (distance runner + farmer), Andrew Bisset (Queenstown Wine Trail MD)
- **Placeholder bios needing more info:** Rich Hatchett, Steve Gallagher, Steve Kay, Gary Clearwater, Paul Robinson, Mike "Cookie" Thurston, Dave Mahony

**Choreographers:**
- **Anna Stuart** — founded Queenstown School of Dance in 2006 (same year as RMB!), rebranded as DEVOS in 2021. Christmas Show choreographer since 2013.
- **Claire Hazledine** — RMB choreographer; did the 2025 Arrowtown Autumn Festival routine to Vivaldi's *Autumn*.

**Scope boundary (from Spike):** Only performers, choreographers, makeup artists on the team page. Not wider show crew.

### Gallery (9 albums, 178+ photos)

Event-grouped (not date-grouped). Christmas Show years: 2019, 2020, 2021, 2023, 2024, 2025. Arrowtown Autumn Festival: 2025, 2026. Plus Spike-uploaded materials.

- **2020 was the troupe's only known Queenstown Winter Festival** appearance (video exists, no photos we have access to)
- **April 2025 Arrowtown** was the troupe's **first ever appearance outside the Christmas Show**
- **Bee Sadalah** (pioneer of Queenstown belly dance, Te Atamira resident) collaborated with RMB — year TBC

### Press (16 articles)

Full-text stored locally (survives dead links). Mostly ODT + Lakes Weekly Bulletin, 2010–2025. Oldest: 2010 ("Dream team" setup piece — proves RMB was active then). Newest: 2025 ("Santa Claus came to town" record 2,700 crowd). Includes the two James Beech 2011 columns from inside the troupe — our best primary source for the 2011 lineup.

### Videos (3 YouTube embeds)

- 2020 Queenstown Winter Festival (`W8spc9iwMcE`)
- 2019 "An intimate look at..." (`CAT6IHf7Sig`)
- 2014 Troupe footage (`Vj-OTNszxr0`)

Christmas Show itself uses Vimeo (not YouTube). RMB does not have its own channel yet. **Social/video setup is deferred** — see `research/social-setup-guide.md`.

---

## Design & brand

- **Palette:** midnight `#131038`, magenta `#ED1968`, gold `#FFD800`, lavender, pearl
- **Fonts:** Playfair Display (headlines), Inter (body), Dancing Script (flourish)
- **Logo:** butterfly mark (placeholder SVG in `assets/images/butterfly.svg` — AI-generated candidates in `legacy/attached_assets/generated_images/`)
- **Tone:** "A little bit Monty Python, a little bit modern. We pretend to take it very seriously." (per Spike)
- **Cause:** Christmas Show overall supports Salvation Army, Happiness House, Baskets of Blessings, Buddy Programme. RMB itself hasn't nominated a specific charity (yet).

---

## Features working today

- Public pages: home, about, team, gallery (with album drill-in), videos, performances, press, timeline, sponsors, contact, submit-memory
- Lightbox gallery: prev/next, Esc, swipe, slideshow autoplay, keyboard shortcuts
- Admin Panel at `/panel`
- Submit-a-memory form with file uploads, honeypot, email notification, draft moderation workflow
- Date formatting via PHP handler (fixed from a bug where it showed "08 12 2025" instead of "08 Dec 2025")
- EXIF-aware photo imports with GPS, taken-at, camera metadata preserved
- Press article cards with conditional 2-col grid layout (via `:has()` CSS)

---

## Open / deferred

- **Deploy to affordabledomains.co.nz** — not done
- **Buy Kirby licence** — needed before true production (~€99)
- **Face detection** for performer-to-gallery-photo matching — Phase 2, planned, Python/dlib approach described in dossier
- **Social setup** (YouTube channel, Facebook strategy) — see `research/social-setup-guide.md`
- **Bios still thin** for ~15 of 34 profiles
- **Photos** for most profiles — 9 of 34 have portraits (public press/business sources)
- **About page copy** — placeholder; needs the real story
- **2012–2023 RMB lineups** — press archive black hole; need Ferg/Doug/Janey direct

---

## Key files to read first (for a fresh collaborator)

1. `research/team-dossier.md` — the research bible. Confirmed names, bio sources, provenance, open gaps.
2. `research/social-setup-guide.md` — YouTube/Vimeo decision framework + 10-min channel setup script.
3. `site/blueprints/pages/person.yml` — content schema for team members.
4. `site/blueprints/pages/album.yml` + `photo.yml` — gallery model.
5. `scripts/seed-team.php` — authoritative source of team data (bios live here, not in `content/`).
6. `scripts/seed-press.php` — same for press.
7. `README.md` — install + deploy instructions.
8. `legacy/replit.md` — original React app's design decisions (useful for the "why" of the current content model).

---

## How Spike has been working

Spike feeds names and context session by session. The pattern is:
- He drops a name or a URL or a correction
- I search / fetch / enrich / update `seed-team.php` or `seed-press.php`
- Re-run the seeder, verify, report

He explicitly said: *"we're still iterating and a long way from going public with the website, I'll sanity check before going live."* So keep things listed/visible for internal review but assume this isn't production yet.

He prefers:
- Direct action, no analysis paralysis
- Decisions off his plate where possible (he's drowning in admin generally — the social setup guide is the pattern)
- Clear "what's next" prompts after each round
- Idempotent scripts over one-off manual edits — so changes compound cleanly across sessions

---

## Memory + session continuity

Claude Code has persistent memory at `C:\Users\UanSpijkerbosch\.claude\projects\D--Git-remarkablementsballet\memory\`. Three files:

- `project_rmb_overview.md` — the project in one page
- `project_rmb_stack.md` — Kirby decision + hosting
- `project_rmb_dev_setup.md` — Laragon wiring

Grokbot likely won't have those files, so this handover doc is the equivalent context.

---

## What's immediately useful to do next

1. **Pick up Spike's open questions** — Bee Sadalah year, Winter Festival year, the 2012–2023 lineup gap
2. **Chase bio photos** for the 25 profiles still without one
3. **Write the About page** — now have enough history for a real narrative
4. **Draft contact emails** to Doug Kamo + Ferg + Janey Rae asking for cast/photo contributions
5. **Set up a GitHub remote** and push, so future handovers are URL-based

Nothing is time-critical. Christmas 2026 is the launch window; it's mid-October now, so ~13 months runway. Spike has signalled he's got plenty on and is comfortable with slow-cook iteration.
