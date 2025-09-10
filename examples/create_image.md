# Creating the Comparison Image

This directory contains multiple format comparison examples showing the same data represented in LiNo, YAML, JSON, and XML formats.

## Files Created

1. **comparison.html** - Full side-by-side comparison in a 2x2 grid
2. **comparison_compact.html** - Compact layout with LiNo/YAML on top, JSON/XML below  
3. **comparison.svg** - SVG version of the comparison
4. **comparison.txt** - ASCII text version
5. **Individual format files**: comparison.lino, comparison.yaml, comparison.json, comparison.xml

## Converting to PNG Image

To create the final PNG image for the README, you can:

### Option 1: Browser Screenshot
1. Open `comparison_compact.html` in a browser
2. Take a screenshot of the rendered page
3. Save as `comparison.png`

### Option 2: Command Line Tools
If you have the tools installed:

```bash
# Using puppeteer (Node.js)
npm install puppeteer
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/comparison_compact.html');
  await page.screenshot({path: 'comparison.png', fullPage: true});
  await browser.close();
})();"

# Using wkhtmltopdf + convert
wkhtmltoimage comparison_compact.html comparison.png

# Using Chrome headless
google-chrome --headless --disable-gpu --screenshot=comparison.png comparison_compact.html
```

### Option 3: Online Tools
Upload the HTML file to any HTML-to-image converter service.

## Usage in README

Replace the current image reference in README.md:
```markdown
![comparison](examples/comparison.png "LiNo, YAML, JSON, XML comparison")
```

The comparison demonstrates:
- **LiNo**: Natural, concise relationship representation
- **YAML**: Structured but verbose with explicit relationships 
- **JSON**: Nested objects with relationship arrays
- **XML**: Most verbose with extensive markup