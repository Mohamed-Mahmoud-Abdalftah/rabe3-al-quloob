#!/usr/bin/env bash
# Smoke test for Rabe3 landing page (run after deploy)
set -euo pipefail
BASE="${1:-https://mohamed-mahmoud-abdalftah.github.io/rabe3-al-quloob}"
SITE="$BASE/rabe3"
FAIL=0

check() {
  local url="$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code $url"
    FAIL=1
  else
    echo "OK   $url"
  fi
}

for f in index.html styles.css i18n.js app.js; do
  check "$SITE/$f"
done

for f in robots.txt sitemap.xml 404.html; do
  check "$BASE/$f"
done

for f in assets/promo/hero_bg.jpg assets/promo/hero_phone.jpg assets/promo/reader.jpg assets/promo/studio.jpg assets/promo/daily.jpg assets/promo/kids_journey.jpg assets/promo/og_brand.jpg assets/rabea_brand_logo.webp assets/kids_bg_sky_hero.jpg; do
  check "$SITE/$f"
done

body=$(curl -s "$SITE/index.html")
if echo "$body" | grep -q 'kids-showcase'; then
  echo "OK   kids-showcase present"
else
  echo "FAIL missing kids-showcase"
  FAIL=1
fi
if echo "$body" | grep -q 'phone-mockup'; then
  echo "OK   phone-mockup present"
else
  echo "FAIL missing phone-mockup"
  FAIL=1
fi
if echo "$body" | grep -q 'kids-pills'; then
  echo "OK   kids-pills present"
else
  echo "FAIL missing kids-pills"
  FAIL=1
fi
if echo "$body" | grep -q 'kids-promo-grid'; then
  echo "FAIL old kids-promo-grid still present"
  FAIL=1
else
  echo "OK   kids-promo-grid removed"
fi
if echo "$body" | grep -q 'kids_bg_sky_hero'; then
  echo "OK   kids sky bg present"
else
  echo "FAIL missing kids sky bg"
  FAIL=1
fi

for lang in ar en tr de es zh ru; do
  body=$(curl -s "$SITE/?lang=$lang")
  if echo "$body" | grep -q 'reveal'; then
    echo "OK   content ?lang=$lang"
  else
    echo "FAIL missing reveal ?lang=$lang"
    FAIL=1
  fi
done

if [[ "$FAIL" -eq 0 ]]; then
  echo "All checks passed."
else
  echo "Some checks failed."
  exit 1
fi
