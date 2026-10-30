# residentland.info

The Resident demoscene group site, built with [Hugo](https://gohugo.io) (extended, 0.146 or newer). Every push to `main` publishes the site.

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

A new `format` shows up as a filter on the prods page automatically. Names in `credits` that match a member handle are linked to that member's page. GitHub rejects files over 100 MB, so link bigger releases from elsewhere.

## Add news

Create `content/news/my-post-title.md` (the file name becomes the URL):

```yaml
---
title: "We won the 4k compo!"
date: 2026-11-15
---
Text in Markdown.
```

## Edit the crew and links

- Members: `data/members.yaml`
- "We love" links: `data/links.yaml`
- Tagline, Pouet and Demozoo links: `[params]` in `hugo.toml`
