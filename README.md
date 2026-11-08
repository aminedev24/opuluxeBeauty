# OpuluxeBeauty

Bilingual (French / Arabic) beauty shop page. Orders go through WhatsApp; there is no cart or checkout.
Live at https://aminedev24.github.io/opuluxeBeauty/

## Files

- `index.html` — the whole site: styles, markup, product data and script.
- `assets/products/` — product drawings (`<name>.svg`) and the same drawings without background (`<name>-cut.svg`), used in the banners and category tiles.
- `p/<ref>/` — one shareable page per product (generated, see below).
- `tools/build-product-pages.mjs` — generates `p/`.

## Before launch

In `index.html`, replace the placeholders:

- `WHATSAPP_NUMBER` — country code, no `+` (e.g. `213555123456`).
- `SOCIAL` — Instagram / Facebook / TikTok links; empty ones are hidden.
- In `T` (French and Arabic texts): `[ZONES DE LIVRAISON]`, `[DÉLAI]`, `[ADRESSE DE LA BOUTIQUE]`, `[JOURS] · [HEURES]`.

## Products

Products live in `PRODUCTS` in `index.html`. `was` is the old price (shows a discount badge and puts the
product in the promo slide/tab), `tag:'new'` marks a new product. After editing products, regenerate the
shareable pages and push:

    node tools/build-product-pages.mjs

Each product then has its own link, e.g. `https://aminedev24.github.io/opuluxeBeauty/p/opb-v01/`, with a
preview image for WhatsApp/Facebook.

## Hero slider

The banners come from `SLIDES`: the main slide, a promo slide (while any product has a `was` price, with the
biggest discount filled in) and a new-arrivals slide (while any product is `tag:'new'`). Ramadan and Eid slides
appear on their own each year using the Islamic calendar; preview them with `?season=ramadan` or `?season=eid`.

## Viewing locally

    python3 -m http.server

then open http://localhost:8000/.

## Second version (`v2/`)

`v2/index.html` is an alternative design of the same shop (light gray background, category list beside
the slider, product rows with "Plus de produits", floating WhatsApp button), live at
https://aminedev24.github.io/opuluxeBeauty/v2/. It has its own copy of the products and texts, so
edit both files when products change. Product share links point to the shared `p/` pages.
