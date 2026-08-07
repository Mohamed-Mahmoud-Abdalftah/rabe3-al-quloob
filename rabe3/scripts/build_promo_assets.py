#!/usr/bin/env python3
"""Build promo JPEGs from user-provided PNGs with verified section mapping."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path(
    "/Users/mohamed/.cursor/projects/Users-mohamed-My-project-quran-quran-android-main/assets"
)
ARCHIVE = Path(__file__).resolve().parents[1] / "assets" / "promo" / "archive"
DST = Path(__file__).resolve().parents[1] / "assets" / "promo"

MAPPING: dict[str, str] = {
    "hero_bg.jpg": "ChatGPT_Image_29_______2026__01_38_29__-49600c8f-07da-4eca-867f-e456c2f845a4.png",
    "hero_phone.jpg": "a1ccb52c-90c3-48e7-8077-30ad92ee6961-e2737634-b97e-41f1-b95e-3f2ecc5a59a7.png",
    "reader.jpg": "ChatGPT_Image_28_______2026__09_13_21__-d3a1c5fe-174a-408e-8f7f-fbe48844a3b8.png",
    "studio.jpg": "ChatGPT_Image_28_______2026__09_20_06__-b3e7fee3-ccd5-4259-9f84-8c141fe51247.png",
    "daily.jpg": "ChatGPT_Image_28_______2026__04_22_54__-b68b6116-1f7f-4850-afe7-a434ea9fab0a.png",
    "premium.jpg": "ChatGPT_Image_28_______2026__03_05_16__-909c8b33-5137-4c2b-b803-f6cae9052e0a.png",
    "og_brand.jpg": "ChatGPT_Image_28_______2026__02_41_48__-dcdc3bbc-341b-4190-ac8f-13c6e934d098.png",
    "kids_journey.jpg": "ChatGPT_Image_28_______2026__09_20_06__-b3e7fee3-ccd5-4259-9f84-8c141fe51247.png",
    "kids_parents.jpg": "ChatGPT_Image_28_______2026__09_22_26__-c1400e9a-4772-401f-ae9f-2c34aa0d70ab.png",
    "onboarding_strip.jpg": "4018b1b2-4964-4c1e-afce-f9ca9fd22065-db8d5609-34fc-4156-8344-f761c753b2ff.png",
}


def resolve_src(name: str) -> Path:
    for base in (SRC, ARCHIVE):
        p = base / name
        if p.exists():
            return p
    raise FileNotFoundError(name)


def save_jpg(im: Image.Image, out: Path, quality: int = 88) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(out, "JPEG", quality=quality, optimize=True)
    print(f"  {out.name}: {rgb.size[0]}x{rgb.size[1]}")


def crop_theme_board() -> None:
    board = resolve_src(
        "9a235d48-6768-4dd7-b7ac-cd2733c0e9df-97db1f9c-d47d-45bc-bb0f-c42890bbf36d.png"
    )
    im = Image.open(board)
    w, h = im.size
    row_y = int(h * 0.72)
    row_h = int(h * 0.12)
    names = ["theme_fajr.jpg", "theme_dhuhr.jpg", "theme_maghrib.jpg", "theme_isha.jpg"]
    for i, name in enumerate(names):
        x0 = int(w * (0.04 + i * 0.24))
        x1 = int(w * (0.04 + (i + 1) * 0.24 - 0.02))
        tile = im.crop((x0, row_y, x1, row_y + row_h))
        tile = tile.resize((420, 664), Image.Resampling.LANCZOS)
        save_jpg(tile, DST / name)

    for side, name in ((0.08, "theme_light.jpg"), (0.52, "theme_dark.jpg")):
        x0 = int(w * side)
        x1 = int(w * (side + 0.38))
        y0 = int(h * 0.06)
        y1 = int(h * 0.52)
        tile = im.crop((x0, y0, x1, y1))
        tile = tile.resize((420, 664), Image.Resampling.LANCZOS)
        save_jpg(tile, DST / name)


def main() -> None:
    print("Building promo assets…")
    DST.mkdir(parents=True, exist_ok=True)

    for out_name, src_name in MAPPING.items():
        im = Image.open(resolve_src(src_name))
        save_jpg(im, DST / out_name)

    try:
        crop_theme_board()
    except Exception as exc:
        print(f"  theme board crop skipped: {exc}")

    print("Done.")


if __name__ == "__main__":
    main()
