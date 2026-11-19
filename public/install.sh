#!/bin/sh
# Installs Halodial: curl -fsSL https://halodial.github.io/install.sh | sh
#
# Downloads the latest Halodial.dmg from github.com/Halodial/releases, checks the app's code signature belongs to
# Halodial's developer, copies it to /Applications and opens it. Files fetched with curl aren't marked as downloaded,
# so macOS opens Halodial without the "Apple could not verify" prompt. Run it again any time to reinstall.
set -eu

URL="https://github.com/Halodial/releases/releases/latest/download/Halodial.dmg"
TEAM="LD9UQ3C3SV"                       # the signing team of every Halodial build
DEST="${HALODIAL_DIR:-/Applications}"   # where to install (override only for testing)

say() { printf '%s\n' "$*"; }
fail() { say "$*" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || fail "Halodial is a Mac app."
[ "$(uname -m)" = "arm64" ] || fail "Halodial needs a Mac with Apple silicon."
major=$(sw_vers -productVersion | cut -d. -f1)
[ "$major" -ge 14 ] || fail "Halodial needs macOS 14 Sonoma or later."
[ -w "$DEST" ] || fail "Can't write to $DEST. Run this from an administrator account."

tmp=$(mktemp -d)
cleanup() { hdiutil detach -quiet "$tmp/mnt" 2>/dev/null || true; rm -rf "$tmp"; }
trap cleanup EXIT INT TERM

say "Downloading Halodial…"
curl -fL --progress-bar -o "$tmp/Halodial.dmg" "$URL" || fail "The download didn't work. Check your connection and try again."
hdiutil attach -nobrowse -quiet -mountpoint "$tmp/mnt" "$tmp/Halodial.dmg" || fail "Couldn't open the downloaded file."

app="$tmp/mnt/Halodial.app"
codesign --verify --deep --strict "$app" 2>/dev/null || fail "The download didn't pass its signature check. Nothing was installed."
codesign -dv "$app" 2>&1 | grep -q "TeamIdentifier=$TEAM" || fail "The download isn't signed by Halodial's developer. Nothing was installed."

if [ -z "${HALODIAL_DIR:-}" ]; then osascript -e 'quit app "Halodial"' >/dev/null 2>&1 || true; fi
rm -rf "$DEST/Halodial.app"
ditto "$app" "$DEST/Halodial.app"
xattr -dr com.apple.quarantine "$DEST/Halodial.app" 2>/dev/null || true

if [ -z "${HALODIAL_DIR:-}" ]; then open "$DEST/Halodial.app"; fi
say "Halodial is installed in $DEST. Look for its ring in the menu bar."
