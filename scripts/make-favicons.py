#!/usr/bin/env python3
"""Build the favicon set from the Bodhan mark.

The mark is fine line art: its strokes are about 1.5% of its height, which is a
quarter of a pixel once the icon is 16px, so the bird dissolves into near-white
and search engines render what looks like an empty square. Two things fix that,
and both are done here rather than at runtime:

  * the mark is knocked out in white on a full-bleed brand-orange tile, so the
    icon carries a block of colour at any size, and
  * its strokes are thickened before downscaling, more heavily for the small
    sizes than the large ones, so they still land on a whole pixel.

Google wants a square favicon whose side is a multiple of 48px, reachable at a
stable URL, so the sizes below are 48-multiples and the files are written into
public/ with fixed names.

Requires Pillow and numpy; neither is a project dependency, so run this in a
throwaway virtualenv when the mark changes:

    python3 -m venv /tmp/icons && /tmp/icons/bin/pip install Pillow numpy
    /tmp/icons/bin/python scripts/make-favicons.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/assets/Icon.png"
PUBLIC = ROOT / "public"

ORANGE = (255, 102, 0)          # --brand-orange
WHITE = (255, 255, 255)
PADDING = 0.10                  # of the mark's longest side, inside the tile
RADIUS = 0.20                   # corner radius as a fraction of the tile
WORKING = 1024                  # the mark is redrawn at this size before scaling

# Stroke weight, in working pixels, by how small the icon will end up. A 16px
# icon needs a much fatter line than a 512px one to survive the downscale.
WEIGHTS = ((32, 25), (10_000, 16))


def load_mark():
    """The mark, cropped to its ink, split into its black and orange parts.

    The source is a 27-megapixel export; dilating at that size takes minutes and
    buys nothing when the largest icon is 512px, so it is reduced first.
    """
    art = Image.open(SOURCE).convert("RGBA")
    art = art.crop(art.getchannel("A").getbbox())
    scale = WORKING / max(art.size)
    art = art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS)
    px = np.array(art).astype(int)
    ink = px[:, :, 3] > 128
    orange = ink & (px[:, :, 0] > 140) & (px[:, :, 0] - px[:, :, 2] > 60)
    return art.size, ink & ~orange, orange


_THICK = {}


def thicken(mask, amount, key):
    """Grow a mask by `amount` pixels, memoised: only two weights are ever used."""
    cached = _THICK.get((key, amount))
    if cached is not None:
        return cached
    out = Image.fromarray((mask * 255).astype("uint8"))
    remaining = amount
    while remaining > 0:
        step = min(9, remaining * 2 + 1)
        step += (step + 1) % 2
        out = out.filter(ImageFilter.MaxFilter(step))
        remaining -= step // 2
    _THICK[(key, amount)] = out
    return out


def tile(size, weight, *, opaque=False):
    """One square icon: the thickened mark, in white, on the orange tile."""
    (w, h), black, orange = MARK
    side = int(max(w, h) * (1 + PADDING * 2))
    canvas = Image.new("RGBA", (side, side), ORANGE + (255,))
    at = ((side - w) // 2, (side - h) // 2)
    for key, part in (("black", black), ("orange", orange)):
        canvas.paste(Image.new("RGBA", (w, h), WHITE + (255,)), at, thicken(part, weight, key))

    if not opaque:
        # Rounded corners, transparent rather than white, so the tile keeps its
        # shape against a dark browser chrome as well as a light one.
        corners = Image.new("L", (side, side), 0)
        ImageDraw.Draw(corners).rounded_rectangle(
            [0, 0, side - 1, side - 1], int(side * RADIUS), fill=255
        )
        canvas.putalpha(corners)

    return canvas.resize((size, size), Image.LANCZOS)


def weight_for(size):
    return next(weight for limit, weight in WEIGHTS if size <= limit)


MARK = load_mark()


def main():
    # One .ico carrying the three sizes browsers and crawlers ask for.
    ico = tile(48, weight_for(16))
    ico.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for size in (96, 192, 512):
        tile(size, weight_for(size)).save(PUBLIC / f"favicon-{size}.png")

    # iOS composites onto its own rounded mask and does not expect alpha, so
    # this one is a plain opaque square.
    tile(180, weight_for(180), opaque=True).convert("RGB").save(
        PUBLIC / "apple-touch-icon.png"
    )

    for path in sorted(PUBLIC.glob("favicon*")) + [PUBLIC / "apple-touch-icon.png"]:
        print(f"  {path.name:<24} {path.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
