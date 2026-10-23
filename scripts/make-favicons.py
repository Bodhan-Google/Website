#!/usr/bin/env python3
"""Build the favicon set from the Bodhan mark.

This is the same bird the tutor bots use, in its own black and orange, so the
site and the apps share one icon. Two things make it work as a favicon, and both
are done here rather than at runtime:

  * the source is cropped to the mark and set on a square white tile. The
    exported master is 5172x5305, not square, and Google will not use a
    favicon that is not square;
  * the strokes are thickened before downscaling, more heavily for the small
    sizes than the large ones. They are about 1.5% of the mark's height, a
    quarter of a pixel at 16px, which is why the bird reads as near-empty
    there otherwise.

The tile is white rather than transparent so the black lines stay visible on a
dark browser tab, and match the white circle Google sets favicons in.

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

INK = (0, 0, 0)                 # the mark's own black
NODE = (225, 102, 52)           # the mark's own orange (#E16634)
WHITE = (255, 255, 255)
PADDING = 0.10                  # of the mark's longest side, inside the tile
RADIUS = 0.20                   # corner radius as a fraction of the tile
WORKING = 1024                  # the mark is redrawn at this size before scaling

# Stroke weight, in working pixels, by how small the icon will end up. Only the
# small sizes are thickened: at 16-32px the original line is under a pixel and
# vanishes, while from 96px up it holds, so those are the logo exactly as drawn.
WEIGHTS = ((32, 25), (48, 12), (10_000, 0))


def load_mark():
    """The mark, cropped to its ink, and split into its three colours.

    The hollow orange rings have opaque WHITE centres that cover the black lines
    running into them, so white is a part of the mark in its own right, not
    background, and is painted back on top after the lines and rings.

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
    white = ink & ~orange & (px[:, :, :3].min(axis=2) > 200)
    black = ink & ~orange & ~white
    return art, black, orange, white


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
    """One square icon: the thickened mark, in its own colours, on a white tile."""
    art, black, orange, white = MARK
    w, h = art.size
    side = int(max(w, h) * (1 + PADDING * 2))
    canvas = Image.new("RGBA", (side, side), WHITE + (255,))
    at = ((side - w) // 2, (side - h) // 2)
    if weight == 0:
        # Large sizes: the artwork itself, untouched.
        canvas.alpha_composite(art, at)
    else:
        # Lines, then rings over them, then the rings' white centres back on
        # top (unthickened, so the hole stays open and the ring grows outward).
        for key, part, colour in (("black", black, INK), ("orange", orange, NODE)):
            canvas.paste(Image.new("RGBA", (w, h), colour + (255,)), at, thicken(part, weight, key))
        canvas.paste(Image.new("RGBA", (w, h), WHITE + (255,)), at, Image.fromarray((white * 255).astype("uint8")))

    if not opaque:
        # Rounded corners, transparent outside, so a dark browser tab shows a
        # white rounded tile rather than a hard white square.
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
