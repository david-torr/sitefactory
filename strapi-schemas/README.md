# Strapi v4 Content Schemas

Derived from the Marriner content model diagram (March 2026).

Each `.json` file maps directly to a Strapi v4 collection type or single type and can be placed into the corresponding `src/api/<type>/content-types/<type>/schema.json` path in a Strapi project. The `components/` subfolder contains inline component schemas, which belong in `src/components/<category>/`.

---

## Type Overview

### Singleton Blocks (Single Types)

These are created once per Strapi instance and act as global site configuration.

| File | Strapi Kind | Purpose |
|---|---|---|
| `site-nav.json` | `singleType` | Global navigation: logo, display mode, nav items, CTA button |
| `site-footer.json` | `singleType` | Global footer: logo, copyright, nav columns, legal links |

---

### Page Components (Collection Types)

Reusable blocks that are assembled onto pages. Each entry is a discrete, named block instance that can be referenced from a page builder.

| File | Strapi Kind | Purpose |
|---|---|---|
| `hero-header.json` | `collectionType` | Full-bleed carousel hero. Holds multiple Hero Slides and an optional link bar. When Site Nav `displayMode` is `overlay`, the nav sits on top of this block. |
| `standard-header.json` | `collectionType` | Simple page header with title, subtitle, and background. Self-contained — no external references. |
| `content-block.json` | `collectionType` | Flexible grid/carousel of Content Items. Supports styles: card, list, carousel, masonry. |
| `object-block.json` | `collectionType` | Icon-driven grid/carousel of Object Items (features, services, team, etc.). |

---

### Items (Collection Types — Referenced)

These are the individual entries referenced by the page components above. They are not used standalone — they are always pulled in via a relation.

| File | Strapi Kind | Purpose |
|---|---|---|
| `nav-link.json` | `collectionType` | A single nav item: label + link. Used in Site Nav (directly) or as children of a Nav Group. |
| `nav-group.json` | `collectionType` | A dropdown nav group: parent label, optional parent link, and many Nav Link children. |
| `hero-slide.json` | `collectionType` | One slide in a Hero Header carousel. Has title, subtitle, bg image/colour, two CTA buttons, and optional background video. |
| `content-item.json` | `collectionType` | A rich content card: title, blurb, image, bg colour, alignment, primary/secondary links, and optional video. |
| `nav-column.json` | `collectionType` | A footer navigation column: titled group of links. |
| `object-item.json` | `collectionType` | An icon-driven object card: icon, title, blurb, bg colour, two button links. |

---

### Shared Objects (Collection Types — Global)

Atomic shared types reused across many other types. Manage them centrally to avoid duplication.

| File | Strapi Kind | Purpose |
|---|---|---|
| `link.json` | `collectionType` | A reusable link: label, URL, open-in-new-tab flag. Referenced by nav items, CTAs, buttons, columns. |
| `video.json` | `collectionType` | A reusable video asset: uploaded file or external URL (YouTube / Vimeo). Referenced by Hero Slide and Content Item. |

---

### Inline Components

These are Strapi components — they are embedded directly inside their parent type and do not exist as standalone entries.

| File | Category | Used in | Purpose |
|---|---|---|---|
| `components/link-bar-item.json` | `hero` | Hero Header | A single item in the hero link bar: icon, title, subtitle, and a link. |

In Strapi, register this as category `hero`, making the component key `hero.link-bar-item`.

---

## Relationship Map

```
Site Nav (singleton)
  ├── navItems (dynamic zone) ──► Nav Link ──► Link
  │                          └──► Nav Group ──► Link (parent)
  │                                         └──► Nav Link[] (children) ──► Link
  └── ctaButtonLink ──────────────────────────► Link

Site Footer (singleton)
  ├── navigationColumns[] ──► Nav Column ──► Link[]
  └── legalLinks[] ────────────────────────► Link[]

Hero Header (collection)
  ├── heroItems[] ──► Hero Slide ──► Link (btn1)
  │                             ├──► Link (btn2)
  │                             └──► Video
  └── linkBarItems[] (component: hero.link-bar-item) ──► Link

Standard Header (collection)
  └── (self-contained, no relations)

Content Block (collection)
  ├── link ──────────► Link
  └── items[] ───────► Content Item ──► Link (primary)
                                    ├──► Link (secondary)
                                    └──► Video

Object Block (collection)
  ├── link ──────────► Link
  └── items[] ───────► Object Item ──► Link (primary btn)
                                   └──► Link (secondary btn)
```

---

## Strapi v4 File Placement

```
src/
├── api/
│   ├── site-nav/content-types/site-nav/schema.json        ← site-nav.json
│   ├── site-footer/content-types/site-footer/schema.json  ← site-footer.json
│   ├── hero-header/content-types/hero-header/schema.json  ← hero-header.json
│   ├── standard-header/...                                ← standard-header.json
│   ├── content-block/...                                  ← content-block.json
│   ├── object-block/...                                   ← object-block.json
│   ├── nav-link/...                                       ← nav-link.json
│   ├── nav-group/...                                      ← nav-group.json
│   ├── hero-slide/...                                     ← hero-slide.json
│   ├── content-item/...                                   ← content-item.json
│   ├── nav-column/...                                     ← nav-column.json
│   ├── object-item/...                                    ← object-item.json
│   ├── link/...                                           ← link.json
│   └── video/...                                          ← video.json
└── components/
    └── hero/
        └── link-bar-item.json                             ← components/link-bar-item.json
```

---

## Notes

- **`draftAndPublish`** is enabled on all page components and their items (hero-slide, content-item, object-item, hero-header, content-block, object-block). It is disabled on structural/config types (nav-link, nav-group, nav-column, link, video, site-nav, site-footer) since these are not editorial content.
- **`site-nav` navItems** uses a dynamic zone (`nav.nav-link` / `nav.nav-group`) to allow mixed nav structures in a single ordered list. If you prefer simpler separate relations, replace the dynamic zone with two `oneToMany` fields: `navLinks` and `navGroups`.
- **Link** is intentionally a collection type (not a component) so links can be reused and updated centrally across multiple types.
