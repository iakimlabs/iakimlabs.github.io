# iakimlabs.com — site guide (technical documentation)

🇷🇺 [Русская версия](SITE-GUIDE.md)

The studio website is built with **GitHub Pages + Jekyll + Bootstrap 5**. No build step is needed: GitHub builds the site on every push.

## Structure

```
_config.yml            site settings (title, email, domain)
_data/
  studio.yml           "About" texts, services, principles, founder name
  navigation.yml       menu items
  languages.yml        languages in the translation menu (Google Translate)
  statuses.yml         app statuses (On Google Play, Closed testing…)
_apps/                 ← one app = one .md file
  mousecrumbs.md
apps/
  index.html           catalog (filters + search)
  mousecrumbs/privacy.md   privacy policy page of the app
assets/
  apps/<slug>/         app icon and screenshots
  css/main.css         styles (colors are variables at the top of the file)
  js/main.js           theme, translation, filters, contact form
docs/                  technical documentation (not published on the site)
index.html, testing.html, about.html, contact.html, privacy.md, 404.html
CNAME                  iakimlabs.com
```

## How to add an app (3 steps)

1. **Copy** `_apps/mousecrumbs.md` → `_apps/<slug>.md` (the slug is Latin letters only, e.g. `screenscan`).
   Fill in the front-matter fields: `title`, `tagline`, `type: game|app`, `status`, `package`, `features`, `privacy`, etc.
   The description goes below the front matter, in Markdown.
2. **Add images** to `assets/apps/<slug>/`: `icon.png` (512×512) and screenshots (portrait, 1080×1920 works well), then set the paths in `icon:` and `screenshots:`.
3. **Create the privacy policy page** `apps/<slug>/privacy.md`:
   ```yaml
   ---
   layout: privacy
   app: <slug>
   permalink: /apps/<slug>/privacy/
   ---
   ```
   - **Option A — your own text:** write the policy in Markdown below the front matter (this is what Mouse Crumbs does).
   - **Option B — generated text:** leave the page body empty and fill the `privacy:` block in the app file (`collects_personal_data`, `data`, `services`); a standard policy is generated from it.
   - Optional app-file fields: `support_email` (a separate contact address for this app) and `privacy.updated` (the policy's effective date).

The app automatically appears in the catalog, on the home page (if `featured: true`), in the footer, in the list of policies on `/privacy/` and in the sitemap.
Its page is `https://iakimlabs.com/apps/<slug>/`, its policy is `https://iakimlabs.com/apps/<slug>/privacy/` — this is the link to put into Play Console.

**Statuses:** `live` ("Get it on Google Play" button), `closed-testing` ("Become a tester" / "Tester link" buttons), `in-development`, `coming-soon`.
Google Play links are built from `package` automatically. When the app is released, just change `status` to `live`.

## Privacy policies

- `/privacy/` — the hub: a list of all app policies (generated from the catalog) plus the policy of the website itself.
- `/apps/<slug>/privacy/` — one policy per app, because each app handles data differently. Use this URL in Play Console.

## Publishing on GitHub Pages

1. Create the repository **`iakimlabs.github.io`** in the `iakimlabs` account and push these files to it.
2. *Settings → Pages*: Source = **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. *Settings → Pages → Custom domain*: `iakimlabs.com` (the `CNAME` file is already there). Once the DNS check passes, enable **Enforce HTTPS**.

### DNS at the domain registrar

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | iakimlabs.github.io |

Remove any leftover parking records (for example ALIAS or a wildcard CNAME) so they don't conflict. AAAA records are optional; the A records are enough.

It is also recommended to verify the domain in *GitHub → Settings → Pages → Verified domains* (a TXT record) so that nobody can attach it to another repository.

## Local preview (optional)

```bash
bundle install
bundle exec jekyll serve
# http://localhost:4000
```

## Translation

The 🌐 menu translates the site with Google Translate. The Google script is loaded **only** when a language other than English is selected
(the choice is stored in the `googtrans` cookie). The brand and app names are marked `notranslate` so they stay untouched.
The list of languages lives in `_data/languages.yml`.

## Theme and styles

Light and dark themes follow the visitor's system setting and can be switched manually (the choice is stored in `localStorage`).
Colors, fonts and radii are CSS variables at the top of `assets/css/main.css`; each app also has its own accent color (`accent:` in the app file).

## Checklist for every new app

- [ ] Real `package`, `min_android`, `version` and `updated` in the app file (match the actual build)
- [ ] The privacy policy matches what the app really does (ads, analytics, permissions, data collection)
- [ ] Icon (512×512) and screenshots are in `assets/apps/<slug>/`
- [ ] The privacy URL is set in Play Console: `https://iakimlabs.com/apps/<slug>/privacy/`
- [ ] After release: `status: live`
