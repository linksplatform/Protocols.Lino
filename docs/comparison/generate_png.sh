#!/bin/bash

# Script to generate PNG from SVG comparison image
# This script requires either ImageMagick (convert), Inkscape, or rsvg-convert

SVG_FILE="comparison.svg"
PNG_FILE="comparison.png"

# Check if SVG file exists
if [ ! -f "$SVG_FILE" ]; then
    echo "Error: $SVG_FILE not found!"
    exit 1
fi

# Try different conversion tools in order of preference
if command -v inkscape &> /dev/null; then
    echo "Using Inkscape to convert SVG to PNG..."
    inkscape "$SVG_FILE" --export-filename="$PNG_FILE" --export-dpi=150
    echo "PNG generated successfully with Inkscape!"
elif command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert to convert SVG to PNG..."
    rsvg-convert -w 1800 -h 1200 "$SVG_FILE" -o "$PNG_FILE"
    echo "PNG generated successfully with rsvg-convert!"
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick to convert SVG to PNG..."
    convert -density 150 -background white "$SVG_FILE" "$PNG_FILE"
    echo "PNG generated successfully with ImageMagick!"
else
    echo "Error: No SVG conversion tool found!"
    echo "Please install one of the following:"
    echo "  - Inkscape: sudo apt-get install inkscape"
    echo "  - librsvg: sudo apt-get install librsvg2-bin"
    echo "  - ImageMagick: sudo apt-get install imagemagick"
    exit 1
fi

# Check if PNG was created successfully
if [ -f "$PNG_FILE" ]; then
    echo "Success! Generated: $PNG_FILE"
    ls -lh "$PNG_FILE"
else
    echo "Error: PNG file was not created!"
    exit 1
fi
