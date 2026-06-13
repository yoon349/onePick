#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IOS="$ROOT/ios"
ARCHIVE="$IOS/build/onePick.xcarchive"
EXPORT_DIR="$IOS/build/ipa-signed"
EXPORT_PLIST="$IOS/ExportOptions.plist"
IPA_OUT="$HOME/Downloads/onePick.ipa"

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

if ! security find-identity -v -p codesigning | grep -q "Apple Development"; then
  echo "❌ Apple Development 인증서가 없습니다."
  echo "   Xcode → Settings → Accounts 에서 Apple ID를 추가한 뒤 다시 실행하세요."
  exit 1
fi

TEAM_ID="${DEVELOPMENT_TEAM:-}"
if [ -z "$TEAM_ID" ]; then
  TEAM_ID=$(security find-identity -v -p codesigning \
    | sed -n 's/.*(\([A-Z0-9]\{10\}\)).*/\1/p' | head -1)
fi

if [ -z "$TEAM_ID" ]; then
  echo "❌ Team ID를 찾을 수 없습니다. Xcode에서 Signing Team을 선택하세요."
  exit 1
fi

echo "▶ Team ID: $TEAM_ID"
echo "▶ pod install"
cd "$IOS"
pod install

echo "▶ archive"
xcodebuild \
  -workspace onePick.xcworkspace \
  -scheme onePick \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE" \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates \
  archive

cat > "$EXPORT_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>development</string>
  <key>teamID</key>
  <string>$TEAM_ID</string>
  <key>compileBitcode</key>
  <false/>
  <key>signingStyle</key>
  <string>automatic</string>
</dict>
</plist>
EOF

rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

echo "▶ export IPA"
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE" \
  -exportPath "$EXPORT_DIR" \
  -exportOptionsPlist "$EXPORT_PLIST" \
  -allowProvisioningUpdates

cp "$EXPORT_DIR/onePick.ipa" "$IPA_OUT"
echo "✅ 서명된 IPA: $IPA_OUT"
