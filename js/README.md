# Lino Protocol Parser for JavaScript

JavaScript implementation of the Lino protocol parser using Bun and Peggy.js.

## Installation

```bash
cd js
bun install
```

## Build

Compile the Peggy.js grammar:

```bash
bun run build:grammar
```

Build the project:

```bash
bun run build
```

## Test

Run tests:

```bash
bun test
```

Watch mode:

```bash
bun test --watch
```

## Usage

```javascript
import { Parser, Link } from '@linksplatform/protocols-lino';

// Create and initialize parser
const parser = new Parser();
await parser.initialize();

// Parse Lino format
const input = `
parent: child1 child2
  nested1
  nested2
`;

const result = parser.parse(input);
console.log(result);

// Create links programmatically
const link = new Link('id', [
  new Link('value1'),
  new Link('value2')
]);
console.log(link.toString()); // (id: value1 value2)
```

## Structure

- `src/grammar.pegjs` - Peggy.js grammar definition
- `src/Link.js` - Link data structure
- `src/LinksGroup.js` - Links group container
- `src/Parser.js` - Parser wrapper
- `tests/` - Test files