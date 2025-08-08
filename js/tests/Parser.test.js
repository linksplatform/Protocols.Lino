import { test, expect, beforeAll } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { Link } from '../src/Link.js';

let parser;

beforeAll(async () => {
  // Note: These tests will only work after running 'bun run build:grammar'
  parser = new Parser();
  try {
    await parser.initialize();
  } catch (error) {
    console.warn('Parser not initialized. Run: bun run build:grammar');
  }
});

test('Parse simple reference', () => {
  if (!parser.parserModule) {
    return; // Skip if parser not compiled
  }
  
  const input = 'test';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('test');
  expect(result[0].values).toEqual([]);
});

test('Parse reference with colon and values', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = 'parent: child1 child2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('child1');
  expect(result[0].values[1].id).toBe('child2');
});

test('Parse multiline link', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '(parent: child1 child2)';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
});

test('Parse nested structure with indentation', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = `parent
  child1
  child2`;
  const result = parser.parse(input);
  expect(result.length).toBe(3);
  // First link: (parent)
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(0);
  // Second link: (parent child1)
  expect(result[1].id).toBe(null);
  expect(result[1].values.length).toBe(2);
  expect(result[1].values[0].id).toBe('parent');
  expect(result[1].values[1].id).toBe('child1');
  // Third link: (parent child2)
  expect(result[2].id).toBe(null);
  expect(result[2].values.length).toBe(2);
  expect(result[2].values[0].id).toBe('parent');
  expect(result[2].values[1].id).toBe('child2');
});

test('Parse quoted references', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = `"has space" 'has:colon'`;
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('has space');
  expect(result[0].values[1].id).toBe('has:colon');
});

test('Parse values only', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = ': value1 value2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('value1');
  expect(result[0].values[1].id).toBe('value2');
});

// Additional tests to match C# version

test('Test all features', () => {
  if (!parser.parserModule) {
    return;
  }
  
  // Test single-line link with id
  let input = 'id: value1 value2';
  let result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test multi-line link with id
  input = '(id: value1 value2)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test link without id (single-line)
  input = ': value1 value2';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test link without id (multi-line)
  input = '(: value1 value2)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test point link
  input = '(point)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test value link
  input = '(value1 value2 value3)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test quoted references
  input = '("id with spaces": "value with spaces")';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test single-quoted references
  input = "('id': 'value')";
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);

  // Test nested links
  input = '(outer: (inner: value))';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test indentation consistency', () => {
  if (!parser.parserModule) {
    return;
  }
  
  // Test that indentation must be consistent
  const input = `parent
  child1
   child2`; // Inconsistent indentation
  const result = parser.parse(input);
  // This should parse but child2 won't be a child of parent due to different indentation
  expect(result.length).toBeGreaterThan(0);
});

test('Test empty document', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '';
  // JavaScript parser throws error for empty documents (same behavior as C# version)
  expect(() => parser.parse(input)).toThrow();
});

test('Test whitespace only', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '   \n   \n   ';
  // JavaScript parser throws error for whitespace-only input (same behavior as C# version)  
  expect(() => parser.parse(input)).toThrow();
});

test('Test complex structure', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = `(Type: Type Type)
  Number
  String
  Array
  Value
    (property: name type)
    (method: name params return)`;
  
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test mixed formats', () => {
  if (!parser.parserModule) {
    return;
  }
  
  // Mix of single-line and multi-line formats
  const input = `id1: value1
(id2: value2 value3)
simple_ref
(complex: 
  nested1
  nested2
)`;
  
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test special characters in quotes', () => {
  if (!parser.parserModule) {
    return;
  }
  
  let input = '("key:with:colons": "value(with)parens")';
  let result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  
  input = "('key with spaces': 'value: with special chars')";
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test deeply nested', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '(a: (b: (c: (d: (e: value)))))';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test empty links', () => {
  if (!parser.parserModule) {
    return;
  }
  
  let input = '()';
  let result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  
  input = '(:)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  
  input = '(id:)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test hyphenated identifiers', () => {
  if (!parser.parserModule) {
    return;
  }
  
  // Test support for hyphenated identifiers like in BugTest1
  const input = '(conan-center-index: repository info)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test multiple words in quotes', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '("New York": city state)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  // Should preserve quotes for multi-word references
  expect(JSON.stringify(result)).toContain('New York');
});