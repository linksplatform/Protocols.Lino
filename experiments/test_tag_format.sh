#!/bin/bash

# Test script to verify new tag format
echo "=== Testing new tag format ==="

# Simulate package versions
JS_VERSION="0.6.0"
RUST_VERSION="0.6.0"
CSHARP_VERSION="0.6.0"

# Test new format: version_language
JS_TAG="${JS_VERSION}_js"
RUST_TAG="${RUST_VERSION}_rust"
CSHARP_TAG="${CSHARP_VERSION}_csharp"

echo "Old format would be:"
echo "  js_0.6.0"
echo "  rust_0.6.0"
echo "  csharp_0.6.0"
echo ""

echo "New format will be:"
echo "  $JS_TAG"
echo "  $RUST_TAG"
echo "  $CSHARP_TAG"
echo ""

echo "Sorting test (old format):"
echo -e "js_0.6.0\nrust_0.6.0\ncsharp_0.6.0\njs_0.7.0\nrust_0.7.0\ncsharp_0.7.0" | sort
echo ""

echo "Sorting test (new format):"
echo -e "0.6.0_js\n0.6.0_rust\n0.6.0_csharp\n0.7.0_js\n0.7.0_rust\n0.7.0_csharp" | sort -V
echo ""

echo "✅ New format sorts by version first, then language!"