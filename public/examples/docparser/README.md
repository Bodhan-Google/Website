# IndicDocParser example page images

These are **composite** images: page scan with layout boxes on the left, OCR
output on the right. The site shows only the left portion, and the hover lens
samples the right portion at the same relative position — so hovering a block on
the page reveals how that block was parsed.

| File | Example |
|---|---|
| `example-1-english-math.png` | English · printed page from Ramanujan's notebooks (p. 229) |
| `example-2-telugu.png` | Telugu · handwritten manuscript page (p. 199) |
| `example-3-hindi.png` | Hindi · handwritten maths worksheet on ruled paper |

Each image's `width`, `height` and `split` are recorded in
`src/features/developers/data/docParserExamples.js`. **If you replace an image,
update those numbers** — `split` is the fraction of the width where the divider
between the two panels sits (0.5 for an even split), and the frame's aspect ratio
is derived from these, so a mismatch skews the lens alignment.

The files here were downscaled to 2600px wide (from 5400px) to keep page weight
reasonable. Full-resolution originals were preserved outside the project, at
`../../../bodhan-example-originals/docparser/` — they are deliberately not in
`public/` so they don't get deployed.

Images load at runtime, so a missing file shows an inline placeholder naming the
expected path rather than breaking the build.
