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

for f in assets/home_hero_day.jpg assets/rabea_brand_logo.webp assets/theme_hero_midnight_mosque.jpg; do
  check "$SITE/$f"
done

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
