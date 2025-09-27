#!/bin/bash

echo "=== C# Workflow Tag Format Test ==="
echo ""

cd csharp || exit 1

PACKAGE_VERSION=$(grep '<VersionPrefix>' Platform.Protocols.Lino/Platform.Protocols.Lino.csproj | sed 's/.*<VersionPrefix>\(.*\)<\/VersionPrefix>.*/\1/')
PACKAGE_ID="Platform.Protocols.Lino"

echo "Package ID: $PACKAGE_ID"
echo "Package Version: $PACKAGE_VERSION"
echo ""

echo "OLD FORMAT: csharp_$PACKAGE_VERSION"
echo "NEW FORMAT: ${PACKAGE_VERSION}_csharp"
echo ""

echo "✅ The new format will be: ${PACKAGE_VERSION}_csharp"