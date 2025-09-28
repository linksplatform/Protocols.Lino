#!/bin/bash

# Test Rust workflow tag creation logic
cd /tmp/gh-issue-solver-1757501955288/rust

PACKAGE_NAME=$(grep '^name = ' Cargo.toml | head -1 | sed 's/name = "\(.*\)"/\1/')
PACKAGE_VERSION=$(grep '^version = ' Cargo.toml | head -1 | sed 's/version = "\(.*\)"/\1/')

echo "Package: $PACKAGE_NAME"
echo "Version: $PACKAGE_VERSION"
echo "New tag format: ${PACKAGE_VERSION}_rust"
echo ""
echo "Command that would be run:"
echo "gh release create \"${PACKAGE_VERSION}_rust\" --title \"[Rust] $PACKAGE_VERSION\" --notes \"https://crates.io/crates/$PACKAGE_NAME\""