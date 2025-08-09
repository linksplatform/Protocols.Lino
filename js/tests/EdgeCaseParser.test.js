import { test, expect } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { formatLinks } from '../src/Link.js';

const parser = new Parser();

test.skip('EmptyLinkTest', () => {
  // Skipped: Not implemented yet in C# version
  const source = ':';
  const target = ':';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('EmptyLinkWithParenthesesTest', () => {
  const source = '()';
  const target = '()';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('EmptyLinkWithEmptySelfReferenceTest', () => {
  const source = '(:)';
  const target = '()';
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('TestAllFeaturesTest', () => {
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
  const input = '';
  // JavaScript parser throws error for empty documents (same behavior as C# version)
  expect(() => parser.parse(input)).toThrow();
});

test('TestWhitespaceOnlyTest', () => {
  const input = '   \n   \n   ';
  // JavaScript parser throws error for whitespace-only input (same behavior as C# version)  
  expect(() => parser.parse(input)).toThrow();
});

test('TestEmptyLinksTest', () => {
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