const { Parser } = require('../js/dist/index.js');

const parser = new Parser();

console.log('Testing multiline quotes as described in issue #53:');
console.log();

const input = `(
  "long
string literal representing
the reference"

  'another
long string literal
as another reference'
)`;

console.log('Input:');
console.log(input);
console.log();

try {
    const result = parser.parse(input);
    console.log('✓ Parsing succeeded!');
    console.log(`Number of links: ${result.length}`);
    console.log('Parsed result:', JSON.stringify(result, null, 2));
} catch (ex) {
    console.log(`✗ Parsing failed: ${ex.message}`);
    console.log(`Exception type: ${ex.constructor.name}`);
}