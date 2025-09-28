#!/bin/bash

# Test C# workflow tag creation logic  
cd /tmp/gh-issue-solver-1757501955288/csharp

# Simulate the files that would be created by read_csharp_package_info.sh
echo "0.6.0" > CSHARP_PACKAGE_VERSION.txt
echo "Now empty list of links is supported.
(:) and : syntax for empty links is now forbidden, to reduce confusion.
Singlet links are supported, no more point link terminology." > CSHARP_PACKAGE_RELEASE_NOTES.txt

REPOSITORY_NAME="Protocols.Lino"
PACKAGE_VERSION=$(cat CSHARP_PACKAGE_VERSION.txt)
PACKAGE_RELEASE_NOTES=$(cat CSHARP_PACKAGE_RELEASE_NOTES.txt)
PACKAGE_URL="https://www.nuget.org/packages/Platform.$REPOSITORY_NAME/$PACKAGE_VERSION"

TAG="${PACKAGE_VERSION}_csharp"
RELEASE_NAME="[C#] $PACKAGE_VERSION"
RELEASE_BODY="$PACKAGE_URL

$PACKAGE_RELEASE_NOTES"

echo "Package: Platform.$REPOSITORY_NAME"
echo "Version: $PACKAGE_VERSION"
echo "New tag format: $TAG"
echo ""
echo "Command that would be run:"
echo "./publish-release.sh \"$TAG\" \"$RELEASE_NAME\" \"$RELEASE_BODY\""

# Cleanup test files
rm -f CSHARP_PACKAGE_VERSION.txt CSHARP_PACKAGE_RELEASE_NOTES.txt