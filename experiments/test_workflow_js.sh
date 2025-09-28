#!/bin/bash

# Test JS workflow tag creation logic
cd /tmp/gh-issue-solver-1757501955288/js

PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "Package: $PACKAGE_NAME"
echo "Version: $PACKAGE_VERSION"
echo "New tag format: ${PACKAGE_VERSION}_js"
echo ""
echo "Command that would be run:"
echo "gh release create \"${PACKAGE_VERSION}_js\" --title \"[JS] $PACKAGE_VERSION\" --notes \"https://www.npmjs.com/package/$PACKAGE_NAME\""