#!/bin/bash

echo "=== Tag Format Sorting Test ==="
echo ""
echo "This script demonstrates the sorting difference between the old and new tag formats."
echo ""

echo "OLD FORMAT (language_version):"
echo "-------------------------------"
(
echo "csharp_0.6.0"
echo "csharp_0.7.0"
echo "csharp_0.8.0"
echo "js_0.6.0"
echo "js_0.7.0"
echo "js_0.8.0"
echo "rust_0.6.0"
echo "rust_0.7.0"
echo "rust_0.8.0"
) | sort

echo ""
echo "NEW FORMAT (version_language):"
echo "-------------------------------"
(
echo "0.6.0_csharp"
echo "0.6.0_js"
echo "0.6.0_rust"
echo "0.7.0_csharp"
echo "0.7.0_js"
echo "0.7.0_rust"
echo "0.8.0_csharp"
echo "0.8.0_js"
echo "0.8.0_rust"
) | sort

echo ""
echo "✅ With the new format, versions are grouped together, making it easier to find all implementations of a specific version."