# Culture banner images

Each language's example panel shows a banner image. The `scene` field in
`src/features/developers/data/cultureThemes.js` points at the file here — it
takes **any** image URL, so a photograph drops in exactly where the current SVG
sits, no code change needed.

## Replacing an SVG with a photograph

1. Put the file here, e.g. `bhojpuri.jpg`.
2. In `cultureThemes.js`, point `scene` at it and add the two companion fields:

```js
bhojpuri: {
  ...
  scene: '/examples/culture/bhojpuri.jpg',
  sceneAlt: 'Devotees offering arghya at sunrise during Chhath Puja on the Ganga',
  credit: 'Photo: <name> / <source>, CC BY-SA 4.0',
},
```

`credit` renders as a caption on the banner. **It is not optional for licensed
photography** — CC-BY/CC-BY-SA and most stock licences require attribution, and
this site is Ministry-affiliated, so provenance needs to be visible.
`sceneAlt` is the screen-reader description; leave it empty only for purely
decorative art.

## Specs

| | |
|---|---|
| Aspect | ~3:1 (the banner crops to `object-position: center 42%`) |
| Size | 1600×540 or larger |
| Weight | Under ~250 KB — export JPEG at quality 80, or WebP |
| Content | Landscape/wide framing; avoid text in the image (it can't be translated or read by screen readers) |

A warm gradient wash is applied over the top so photographs sit with the site's
cream palette rather than fighting it.

## Sourcing

Use images you have the right to publish:

- **Your own field photography** — best option: correct, current, and unambiguously licensed.
- **Wikimedia Commons** — many CC-BY-SA and public-domain images of Chhath, Sohrai art, temple festivals. Record the author and licence in `credit`.
- **Licensed stock** — Getty, Shutterstock, or Indian libraries like IndiaPicture.
- **Cultural archives** — Sahapedia and Ministry of Culture collections, subject to their terms.

Do not paste in images found via a search engine without checking the licence.
