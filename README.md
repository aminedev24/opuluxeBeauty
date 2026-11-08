# OpuluxeBeauty – landing page (FR AR) — design reference

This is a design mockup created in a visual design tool, exported as a
standalone page. Treat it as a REFERENCE MOCKUP, not production code:
the markup and inline styles carry the design's precise values — colors,
font sizes, spacing, radii, shadows, layout — which an implementation
should replicate faithfully in its own components and styling system
rather than copy wholesale.

## Contents

- `Main.dc.html` — the artboard (a Design Component: an `<x-dc>`
  template + a small logic class). The values to replicate live in its
  inline `style="…"` attributes and the `<helmet><style>` block.
- `assets/` — files uploaded to the design (images, fonts, media)
- `support.js`, `vendor/react*.js` — the runtime that renders the
  component in a browser; not part of the design.

## Uploaded files

Images, fonts and media uploaded to the design are written once each under
`assets/` — 8 in this export — and the exported files refer to them there. A
reference a script puts together while the page runs (for example
`"/_blob/" + id`) is not rewritten and does not load from this folder.

## Viewing

Serve the folder (e.g. `python3 -m http.server`) and open `Main.dc.html`;
some browsers block the scripts over file://.

## Product pages (shareable links)

Each product has its own link, e.g. `https://aminedev24.github.io/opuluxeBeauty/p/opb-v01/`,
with a title, description and preview image for WhatsApp/Facebook. The "Partager" button in the
product view shares it. After editing `PRODUCTS` in `index.html`, regenerate the pages:

    node tools/build-product-pages.mjs

## Hero slider

The hero rotates through the slides in `SLIDES` (in `index.html`): the main slide, a promo slide
(shown while any product has a `was` price, with the biggest discount filled in automatically) and
a new-arrivals slide (while any product has `tag:'new'`). Ramadan and Eid slides appear on their own
each year, using the Islamic calendar. Preview them any day with `?season=ramadan` or `?season=eid`.
