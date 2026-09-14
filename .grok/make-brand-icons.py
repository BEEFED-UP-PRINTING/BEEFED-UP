from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path("/workspace/.grok")
BG = (10, 10, 11, 255)          # #0a0a0b
INK = (243, 241, 234, 255)      # #f3f1ea
HAIR = (38, 38, 43, 255)        # #26262b
FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"


def render_mark(size: int) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    radius = round(7 / 32 * s)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=BG)

    inset = max(scale, round(0.6 / 32 * s))
    stroke = max(scale, round(1.2 / 32 * s))
    inner_r = max(0, radius - inset)
    d.rounded_rectangle(
        (inset, inset, s - 1 - inset, s - 1 - inset),
        radius=inner_r,
        outline=HAIR,
        width=stroke,
    )

    # Glyph occupies ~center 55% — well inside the maskable 80% safe zone.
    font = ImageFont.truetype(FONT_PATH, size=round(20 / 32 * s))
    bbox = d.textbbox((0, 0), "B", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (s - tw) / 2 - bbox[0]
    # Optical center: serif B sits slightly high if we use geometric center
    y = (s - th) / 2 - bbox[1] + round(0.4 / 32 * s)
    d.text((x, y), "B", font=font, fill=INK)

    return img.resize((size, size), Image.Resampling.LANCZOS)


for size, name in ((16, "favicon-16-preview.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    render_mark(size).save(OUT / name, "PNG")
    print("wrote", name)
