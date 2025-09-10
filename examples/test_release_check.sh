#!/bin/bash

# Test script to verify the release check logic
# This simulates what the GitHub Actions workflows would do

echo "=== Testing JS release check logic ==="
cd js
PACKAGE_VERSION=$(node -p "require('./package.json').version")
TAG_NAME="js_$PACKAGE_VERSION"
echo "Checking if release $TAG_NAME already exists"

if gh release view "$TAG_NAME" >/dev/null 2>&1; then
    echo "✅ Release $TAG_NAME already exists - would skip creation"
    SHOULD_CREATE_JS=false
else
    echo "❌ Release $TAG_NAME does not exist - would create"
    SHOULD_CREATE_JS=true
fi

echo
echo "=== Testing Rust release check logic ==="
cd ../rust
PACKAGE_VERSION=$(grep '^version = ' Cargo.toml | head -1 | sed 's/version = "\(.*\)"/\1/')
TAG_NAME="rust_$PACKAGE_VERSION"
echo "Checking if release $TAG_NAME already exists"

if gh release view "$TAG_NAME" >/dev/null 2>&1; then
    echo "✅ Release $TAG_NAME already exists - would skip creation"
    SHOULD_CREATE_RUST=false
else
    echo "❌ Release $TAG_NAME does not exist - would create"
    SHOULD_CREATE_RUST=true
fi

echo
echo "=== Summary ==="
echo "JS release creation needed: $SHOULD_CREATE_JS"
echo "Rust release creation needed: $SHOULD_CREATE_RUST"
echo "Both workflows should now handle existing releases gracefully!"