#!/bin/bash

echo "=== Rust Workflow Tag Format Test ==="
echo ""

cd rust || exit 1

PACKAGE_NAME=$(grep '^name = ' Cargo.toml | head -1 | sed 's/name = "\(.*\)"/\1/')
PACKAGE_VERSION=$(grep '^version = ' Cargo.toml | head -1 | sed 's/version = "\(.*\)"/\1/')

echo "Package Name: $PACKAGE_NAME"
echo "Package Version: $PACKAGE_VERSION"
echo ""

echo "OLD FORMAT: rust_$PACKAGE_VERSION"
echo "NEW FORMAT: ${PACKAGE_VERSION}_rust"
echo ""

echo "✅ The new format will be: ${PACKAGE_VERSION}_rust"