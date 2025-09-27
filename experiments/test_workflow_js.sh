#!/bin/bash

echo "=== JS Workflow Tag Format Test ==="
echo ""

cd js || exit 1

PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "Package Name: $PACKAGE_NAME"
echo "Package Version: $PACKAGE_VERSION"
echo ""

echo "OLD FORMAT: js_$PACKAGE_VERSION"
echo "NEW FORMAT: ${PACKAGE_VERSION}_js"
echo ""

echo "✅ The new format will be: ${PACKAGE_VERSION}_js"