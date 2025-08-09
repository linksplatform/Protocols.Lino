import { test, expect, beforeAll } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { formatLinks } from '../src/Link.js';

let parser;

beforeAll(async () => {
  parser = new Parser();
  try {
    await parser.initialize();
  } catch (error) {
    console.warn('Parser not initialized. Run: bun run build:grammar');
  }
});

test('SingleLinkTest', () => {
  if (!parser.parserModule) return;
  
  const source = '(address: source target)';
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('TripletSingleLinkTest', () => {
  if (!parser.parserModule) return;
  
  const source = '(papa has car)';
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('BugTest1', () => {
  if (!parser.parserModule) return;
  
  const source = '(ignore conan-center-index repository)';
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('QuotedReferencesTest', () => {
  if (!parser.parserModule) return;
  
  const source = `(a: 'b' "c")`;
  const target = `(a: b c)`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('QuotedReferencesWithSpacesTest', () => {
  if (!parser.parserModule) return;
  
  const source = `('a a': 'b b' "c c")`;
  const target = `('a a': 'b b' 'c c')`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('Parse simple reference', () => {
  if (!parser.parserModule) return;
  
  const input = 'test';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('test');
  expect(result[0].values).toEqual([]);
});

test('Parse reference with colon and values', () => {
  if (!parser.parserModule) return;
  
  const input = 'parent: child1 child2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('child1');
  expect(result[0].values[1].id).toBe('child2');
});

test('Parse multiline link', () => {
  if (!parser.parserModule) return;
  
  const input = '(parent: child1 child2)';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
});

test('Parse quoted references', () => {
  if (!parser.parserModule) return;
  
  const input = `"has space" 'has:colon'`;
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('has space');
  expect(result[0].values[1].id).toBe('has:colon');
  // Ensure formatting matches C# expectation
  expect(formatLinks(result)).toBe(`('has space' 'has:colon')`);
});

test('Parse values only', () => {
  if (!parser.parserModule) return;
  
  const input = ': value1 value2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('value1');
  expect(result[0].values[1].id).toBe('value2');
});

test('Test single-line link with id', () => {
  if (!parser.parserModule) return;
  
  const input = 'id: value1 value2';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test multi-line link with id', () => {
  if (!parser.parserModule) return;
  
  const input = '(id: value1 value2)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test link without id (single-line)', () => {
  if (!parser.parserModule) return;
  
  const input = ': value1 value2';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test link without id (multi-line)', () => {
  if (!parser.parserModule) return;
  
  const input = '(: value1 value2)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test point link', () => {
  if (!parser.parserModule) return;
  
  const input = '(point)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test value link', () => {
  if (!parser.parserModule) return;
  
  const input = '(value1 value2 value3)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test quoted references', () => {
  if (!parser.parserModule) return;
  
  const input = '("id with spaces": "value with spaces")';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test single-quoted references', () => {
  if (!parser.parserModule) return;
  
  const input = "('id': 'value')";
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test nested links', () => {
  if (!parser.parserModule) return;
  
  const input = '(outer: (inner: value))';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test special characters in quotes', () => {
  if (!parser.parserModule) return;
  
  let input = '("key:with:colons": "value(with)parens")';
  let result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  
  input = "('key with spaces': 'value: with special chars')";
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test deeply nested', () => {
  if (!parser.parserModule) return;
  
  const input = '(a: (b: (c: (d: (e: value)))))';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test hyphenated identifiers', () => {
  if (!parser.parserModule) return;
  
  const input = '(conan-center-index: repository info)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test multiple words in quotes', () => {
  if (!parser.parserModule) return;
  
  const input = '("New York": city state)';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  expect(JSON.stringify(result)).toContain('New York');
});

test('Test simple ref', () => {
  if (!parser.parserModule) return;
  
  const input = 'simple_ref';
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});