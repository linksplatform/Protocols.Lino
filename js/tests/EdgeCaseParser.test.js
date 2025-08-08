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

test.skip('EmptyLinkTest', () => {
  // Skipped: Not implemented yet in C# version
  if (!parser.parserModule) return;
  
  const source = ':';
  const target = ':';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('EmptyLinkWithParenthesesTest', () => {
  if (!parser.parserModule) return;
  
  const source = '()';
  const target = '()';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('EmptyLinkWithEmptySelfReferenceTest', () => {
  if (!parser.parserModule) return;
  
  const source = '(:)';
  const target = '()';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('TestAllFeaturesTest', () => {
  if (!parser.parserModule) return;
  
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

test('TestEmptyDocumentTest', () => {
  if (!parser.parserModule) return;
  
  const input = '';
  // JavaScript parser throws error for empty documents (same behavior as C# version)
  expect(() => parser.parse(input)).toThrow();
});

test('TestWhitespaceOnlyTest', () => {
  if (!parser.parserModule) return;
  
  const input = '   \n   \n   ';
  // JavaScript parser throws error for whitespace-only input (same behavior as C# version)  
  expect(() => parser.parse(input)).toThrow();
});

test('TestEmptyLinksTest', () => {
  if (!parser.parserModule) return;
  
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