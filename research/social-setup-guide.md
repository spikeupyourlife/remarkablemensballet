# RMB social & video setup — when you're ready

This is a *defer-able* guide. None of this needs to happen before the site goes live. When you (or whoever wants to handle it) is ready, follow the script below — no strategic thinking required.

---

## Decision: YouTube OR Vimeo?

**Answer: don't decide.** Use whichever you/the team have time for first. The video blueprint accepts both — paste any URL, the embed just works.

If you want a default recommendation: **YouTube for new content, Vimeo for archive embeds.**

| | YouTube | Vimeo |
|---|---|---|
| **Cost** | Free | Free tier OK; Pro ~$15/month |
| **Discoverability** | High — search-engine indexed | Low — niche platform |
| **Ads** | Sometimes shown on embeds | Never |
| **Existing RMB / Christmas Show presence** | 3 known RMB videos on third-party channels (2014, 2019, 2020) | Christmas Show 2021 already lives there |
| **Embedding quality** | Excellent | Excellent |
| **Setup effort** | 10 min (any Gmail account) | 10 min |

**Practical path:**
- For *historic* footage already on the Christmas Show's Vimeo — just paste those URLs into Kirby video pages. No new accounts needed.
- For *new* uploads going forward (rehearsal footage, behind-the-scenes, the 20th anniversary show) — set up YouTube.
- The site supports both side by side. No tension between them.

---

## YouTube channel setup — 10-minute script

When you (or Doug, Ferg, Janey, whoever) wants to spin this up:

### Step 1. Create the channel
1. Sign in to YouTube with any Gmail account (suggest: a dedicated `remarkablemensballet@gmail.com`, not personal)
2. Click profile picture → "Create a channel"
3. Channel name: **Remarkable Men's Ballet**
4. Handle: `@RemarkableMensBallet` (or whatever's free)

### Step 2. Channel description (copy-paste)

> The Remarkable Men's Ballet — a Queenstown Christmas Show tradition since 2006. Big lads. Tiny tutus. Slightly questionable choreography. All for the kids.
>
> Founded by Doug Kamo and Simon Green. Twenty years of doing it for the laughs (and the local Salvation Army).
>
> Find us at remarkablemensballet.co.nz · part of @christmasshowqt

### Step 3. Channel art
- **Banner**: 2560 x 1440 px (looks fine at 1546 x 423 too). Use one of the group shots — the one already on the homepage works.
- **Profile picture**: 800 x 800 px. The butterfly icon from the site works, or use a tight crop of a group shot.
- **Watermark**: small RMB logo for video corners. Optional.

### Step 4. Privacy / monetisation
- Public uploads only — don't bother with monetisation. It's a community/charity thing.
- Allow embedding (default).
- Allow comments — but enable "Hold all comments for review" so nothing nasty slips through.

### Step 5. First videos to upload
- The 2020 VID file currently sitting locally in `content/4_gallery/2_christmas-show-2020/` (`VID_20201213_174718.mp4`, 259 MB) — once uploaded, we can delete the local copy. The file is gitignored so it only exists on Spike's machine. (Note: this is a different clip from the 2020 Winter Festival YouTube embed we already have.)
- Any historic footage Doug / Ferg / Christmas Show team has
- The intimate-look YouTube clip (`CAT6IHf7Sig`) — find out who owns it and either keep linking or arrange a re-upload to the RMB channel

### Step 6. Add to the site
- Panel → Videos → Add video page
- Paste the YouTube URL
- Title, description, year — done

---

## Social media (also defer-able)

If/when you want a social presence:

- **Facebook**: piggyback on the Christmas Show's existing page ([christmasshowqt](https://www.facebook.com/christmasshowqt/)) for cross-posts, rather than running a separate one. Less admin.
- **Instagram**: only worth setting up if someone wants to actually post regularly (~1/week minimum). If no one's volunteered, skip it.
- **TikTok**: same — only if someone wants the workload. The "burly men in tutus" content would *probably* do well there, but only if maintained.

---

## What Claude/Grok can write for you when you're ready

Just give the AI a heads-up and it'll draft:
- The email to Doug + Ferg + Janey explaining the website and asking for: founding year confirmation, missing bios, photos, video URLs
- The "submit your bio" form text (linked from team page)
- Channel descriptions, About page tweaks, video descriptions in your voice
- Sponsor pitch deck text (when there are sponsors)

You decide; the AI writes.

---

## Bottom line

The site works without any of this. The video blueprint is wired up; the moment any URL exists, paste it in and the embed appears. None of this needs to happen before launch.

Don't sweat the social stuff.
