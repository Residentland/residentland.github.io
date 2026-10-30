# residentland.info

The Resident demoscene group site, built with [Hugo](https://gohugo.io) (extended, 0.146 or newer).

## Run it locally

```sh
hugo server
```

Then open http://localhost:1313. Add `-D` to also show draft posts.

## Add a production

Every prod is a folder under `content/prods/` holding an `index.md`, a screenshot named `screen.png`, `screen.gif` or `screen.jpg`, and the release archive:

```
content/prods/my-new-4k/
  index.md
  screen.png
  mynew4k.zip
```

```yaml
---
title: "My New 4k"
date: 2026-11-14
format: "4k"                 # Demo, Intro, 64k, 4k, 256b, 128b, Game ...
platform: "PC / Windows"
party:
  name: "Some Party 2026"
  url: "https://example.org/"
pouet: 123456                # optional, Pouet prod id
demozoo: 654321              # optional, Demozoo production id
youtube: "dQw4w9WgXcQ"       # optional, replaces the screenshot with a video
download: "mynew4k.zip"      # file in this folder, or a full https:// link
credits:
  - role: Code
    who: ["spritus", "tesla"]
  - role: Music
    who: ["flexi"]
members: ["spritus", "tesla", "flexi"]   # links the prod to member pages
---
Optional notes about the prod go here.
```

A new `format` shows up as a filter on the prods page automatically. The Download button shows the file size for archives kept in the folder. GitHub rejects single files over 100 MB, so link bigger releases from elsewhere. Names in `credits` that match a member handle are linked to that member's page.

## Add news

Create `content/news/my-post-title.md` (the file name becomes the URL):

```yaml
---
title: "We won the 4k compo!"
date: 2026-11-15
---
Text in Markdown.
```

`content/news/hello-hugo.md` is a ready-made announcement for the move, saved as a draft. Delete its `draft: true` line to publish it.

## Edit the crew and links

- Members: `data/members.yaml`
- "We love" links: `data/links.yaml`
- Tagline, Pouet and Demozoo links: `[params]` in `hugo.toml`

## Layout

| Path | What |
| --- | --- |
| `layouts/home.html` | Front page with the hero and all prods |
| `layouts/prods/` | Prod list with filters, and the single prod page |
| `layouts/members/` | Member roster and each member's prods |
| `assets/js/fx.js` | Hero effect: plasma, copper bars, logo wobble |
| `assets/css/main.css` | All styles |

## Deploy to GitHub Pages

1. Push this folder to the `main` branch of the GitHub repo.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**. `.github/workflows/hugo.yml` then builds and publishes the site on every push.
3. Still in **Settings → Pages**, set **Custom domain** to `www.residentland.info` and turn on **Enforce HTTPS** once the certificate is issued.
4. At your DNS provider, point `www` at GitHub with a `CNAME` record to `<your-github-user-or-org>.github.io`. For the bare `residentland.info`, add `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.

Old Blogger addresses such as `/p/nested-64k.html`, `/p/members.html` and `/2019/06/new-site.html` redirect to their new pages.
