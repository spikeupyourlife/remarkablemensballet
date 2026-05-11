# Remarkable Men's Ballet — remarkablemensballet.co.nz

The 20th-anniversary site for the Queenstown Christmas Show's most cherished cameo.

Built on [Kirby CMS](https://getkirby.com) — flat-file PHP, no database, runs on standard cPanel/LiteSpeed shared hosting.

## Stack

- **CMS**: Kirby 4 (PHP 8.1+)
- **Host**: affordabledomains.co.nz — cPanel + LiteSpeed + PHP 8.1
- **Content storage**: flat files in `/content` (Markdown + YAML-ish frontmatter)
- **No database needed**
- **Fonts**: Playfair Display, Inter, Dancing Script (Google Fonts)
- **Palette**: midnight `#131038`, magenta `#ED1968`, gold `#FFD800`, lavender, pearl

## Repository layout

```
/
├── content/        ← all page content (flat files — backup = copy this folder)
├── site/
│   ├── blueprints/ ← Panel forms (content schema)
│   ├── templates/  ← page templates (PHP)
│   ├── snippets/   ← reusable bits (header, footer, cards, hero, video embed)
│   ├── controllers/← form handlers (e.g. memory submissions)
│   ├── plugins/    ← site-specific helpers
│   ├── accounts/   ← user accounts (gitignored)
│   └── config/     ← config.php
├── assets/         ← css, js, images
├── kirby/          ← Kirby core (installed via Composer — gitignored)
├── legacy/         ← archived Replit/React app, kept as reference only
├── index.php       ← Kirby bootstrap
├── .htaccess       ← Apache / LiteSpeed rewrites
└── composer.json
```

## Local development

Requires PHP 8.1+ and [Composer](https://getcomposer.org).

```powershell
# 1. Install Kirby core
composer install

# 2. Run the built-in PHP server
php -S localhost:8000 -t .
```

Open `http://localhost:8000` for the site, and `http://localhost:8000/panel` for the admin Panel. First visit to `/panel` will prompt you to create the first admin user.

### Kirby licence

Kirby is **commercial**. You can run it locally and on staging without a licence (it'll show a banner). For production you need to buy a licence at <https://getkirby.com/buy> — €99 for a single-site personal licence at time of writing. Charity / non-profit pricing may be available — worth asking.

## Deploying to affordabledomains.co.nz (cPanel + LiteSpeed)

You have two paths:

### Option A — Composer on the server (preferred)

If SSH is enabled on your plan:

```bash
# On the server, in public_html/
git clone <repo-url> .
composer install --no-dev --optimize-autoloader
```

### Option B — Upload everything as a zip

1. Run `composer install --no-dev --optimize-autoloader` locally.
2. Zip the project (include `/kirby` and `/vendor`, exclude `/legacy`, `/node_modules` etc.).
3. Upload via File Manager in cPanel and extract into `public_html/`.

### After deploy

1. Ensure `site/accounts`, `site/sessions`, `site/cache`, `site/logs`, and `media/` are **writable** by the web server.
2. Set the Kirby licence key via Panel.
3. Visit `/panel`, create your admin user, and start adding content.

LiteSpeed handles `.htaccess` exactly the same way Apache does — no rewrites needed.

## Content model — what lives where

| Page         | Template          | Children          | Purpose                                         |
|--------------|-------------------|-------------------|-------------------------------------------------|
| Home         | `home`            | —                 | Hero, intro, featured team, next show           |
| About        | `about`           | —                 | The story                                       |
| Team         | `team`            | `person`          | Performers, choreographers, makeup, crew, fans  |
| Gallery      | `gallery`         | `photo`           | Photos with 5W tags (who/what/when/where/why)   |
| Videos       | `videos`          | `video`           | YouTube + Vimeo embeds, custom thumbnails       |
| Performances | `performances`    | `performance`     | Show dates, venues, multiple times, tickets     |
| Press        | `press`           | `press-article`   | Full-text archive (survives dead links)         |
| Timeline     | `timeline`        | `year`            | 20-year year-by-year archive                    |
| Sponsors     | `sponsors`        | `sponsor`         | Tiered sponsor list + cause/donation block      |
| Contact      | `contact`         | —                 | Public contact details                          |
| Submit       | `submit-memory`   | `memory` (drafts) | Public submission form for fan photos/stories   |

## User roles

- **Admin** — full access (site settings, users, all content).
- **Editor** — can add/edit content but can't change site settings or users.

Create new users from the Panel under Users.

## Memory submissions

Public submissions hit `/submit-memory`. Submissions are saved as **draft** pages under `submit-memory/` and emailed to the address in Brand → Contact email. Editors review and either publish them to the Gallery or attach them to a Timeline year.

Honeypot field is the only spam protection right now — add hCaptcha later if needed.

## Roadmap

- [ ] Phase 1 — Foundation (this commit): scaffold, blueprints, base templates, theme
- [ ] Phase 2 — Content: bring across real photos, performer profiles, press archive
- [ ] Phase 3 — 20-year timeline pages + crowdsource memories
- [ ] Phase 4 — Comments + social login for fans (moderated)
- [ ] Phase 5 — Sponsors + donation integration
- [ ] Phase 6 — SEO, OG cards, sitemap, analytics
- [ ] Phase 7 — Launch (Christmas 2026)

## The archived Replit app

The original Replit/React/Express/Postgres app lives in `/legacy`. It's kept for reference (content model, taxonomy, copy) but is not part of the deployed site and won't run on the target host.
