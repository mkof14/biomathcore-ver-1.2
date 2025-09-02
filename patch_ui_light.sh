#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

echo "→ 1) Add ui-light stylesheet"
mkdir -p "$ROOT/src/styles"
cat > "$ROOT/src/styles/ui-light.css" <<'CSS'
/* src/styles/ui-light.css */
/* Light UI scope for internal member pages only */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Only inside .ui-light we force readable light theme surfaces */
.ui-light {
  @apply text-gray-900;
  background-color: transparent; /* don't override page bg */
}

.ui-light .surface,
.ui-light .card {
  @apply bg-white text-gray-900;
}

/* Typical card container */
.ui-light .card {
  @apply rounded-xl border border-gray-200 p-4;
}

/* Form controls readable by default inside ui-light */
@layer base {
  .ui-light input[type="text"],
  .ui-light input[type="email"],
  .ui-light input[type="password"],
  .ui-light input[type="search"],
  .ui-light input[type="number"],
  .ui-light input[type="url"],
  .ui-light input[type="tel"],
  .ui-light textarea,
  .ui-light select {
    @apply bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2;
  }

  .ui-light button {
    @apply text-gray-900;
  }
}

/* Common buttons */
.ui-light .btn-primary {
  @apply rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60;
}
.ui-light .btn-secondary {
  @apply rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-50;
}

/* Links */
.ui-light a {
  @apply text-gray-900;
}
.ui-light a:hover {
  @apply underline;
}
CSS
echo "✓ wrote: src/styles/ui-light.css"

echo "→ 2) Ensure globals import ui-light.css"
GLOBAL="$ROOT/src/app/globals.css"
if [ -f "$GLOBAL" ]; then
  if ! grep -q 'styles/ui-light.css' "$GLOBAL"; then
    echo '@import "../styles/ui-light.css";' >> "$GLOBAL"
    echo "✓ appended import to src/app/globals.css"
  else
    echo "• src/app/globals.css already imports ui-light.css"
  fi
else
  # If globals.css is missing, create a minimal one
  mkdir -p "$ROOT/src/app"
  cat > "$ROOT/src/app/globals.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "../styles/ui-light.css";
CSS
  echo "✓ created src/app/globals.css with import"
fi

echo "→ 3) Wrap our pages with .ui-light container"

/* Devices page */
DEV_PAGE="$ROOT/src/app/member-zone/devices/page.tsx"
if [ -f "$DEV_PAGE" ]; then
  # Replace top-level <section ...> to include ui-light class
  perl -0777 -pe 's/<section className="([^"]*)">/<section className="ui-light \1">/ if $.==1 or 1' "$DEV_PAGE" > "$DEV_PAGE.tmp" && mv "$DEV_PAGE.tmp" "$DEV_PAGE"
  echo "✓ updated: member-zone/devices/page.tsx"
else
  echo "• skip: devices page not found"
fi

/* BlackBox notes page */
BB_PAGE="$ROOT/src/app/member-zone/blackbox/notes/page.tsx"
if [ -f "$BB_PAGE" ]; then
  perl -0777 -pe 's/<section className="([^"]*)">/<section className="ui-light \1">/ if $.==1 or 1' "$BB_PAGE" > "$BB_PAGE.tmp" && mv "$BB_PAGE.tmp" "$BB_PAGE"
  echo "✓ updated: member-zone/blackbox/notes/page.tsx"
else
  echo "• skip: blackbox notes page not found"
fi

echo "→ 4) Clear Next cache"
rm -rf "$ROOT/.next" || true

echo
echo "✅ Done. Now run: npm run dev"
echo "Check: /member-zone/devices and /member-zone/blackbox/notes"
echo
