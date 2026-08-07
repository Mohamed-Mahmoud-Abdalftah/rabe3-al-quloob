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

for f in \
  assets/home_hero_day.jpg \
  assets/promo/crops/theme_6_showcase.jpg \
  assets/promo/crops/reader_phone.jpg \
  assets/promo/crops/studio_phone.jpg \
  assets/promo/crops/kids_phone.jpg \
  assets/promo/crops/daily_phone.jpg \
  assets/promo/crops/premium_phone.jpg \
  assets/promo/crops/theme_golden_dawn.jpg \
  assets/promo/og_brand.jpg \
  assets/rabea_brand_logo.webp; do
  check "$SITE/$f"
done

body=$(curl -s "$SITE/index.html")
if echo "$body" | grep -q 'showcase-band'; then
  echo "OK   showcase-band present"
else
  echo "FAIL missing showcase-band"
  FAIL=1
fi
if echo "$body" | grep -q 'kids-visual-stack'; then
  echo "OK   kids-visual-stack present"
else
  echo "FAIL missing kids-visual-stack"
  FAIL=1
fi
if echo "$body" | grep -q 'device-frame--exp'; then
  echo "OK   device-frame--exp present"
else
  echo "FAIL missing device-frame--exp"
  FAIL=1
fi
if echo "$body" | grep -q 'styles.css?v=26'; then
  echo "OK   styles v26"
else
  echo "FAIL missing styles v26"
  FAIL=1
fi
if echo "$body" | grep -q 'phone-mockup'; then
  echo "FAIL old phone-mockup still present"
  FAIL=1
else
  echo "OK   phone-mockup removed"
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
