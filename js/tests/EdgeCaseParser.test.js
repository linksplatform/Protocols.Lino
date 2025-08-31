import { test, expect } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { formatLinks } from '../src/Link.js';

const parser = new Parser();

test('EmptyLinkTest', () => {
  const source = ':';
  // Standalone ':' is now forbidden and should throw an error
  expect(() => parser.parse(source)).toThrow();
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
  // '(:)' is now forbidden and should throw an error
  expect(() => parser.parse(source)).toThrow();
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

  // Test link without id (single-line) - now forbidden
  input = ': value1 value2';
  expect(() => parser.parse(input)).toThrow();

  // Test link without id (multi-line) - now forbidden
  input = '(: value1 value2)';
  expect(() => parser.parse(input)).toThrow();

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
  // Empty document should return empty array
  const result = parser.parse(input);
  expect(result).toEqual([]);
});

test('TestWhitespaceOnlyTest', () => {
  const input = '   \n   \n   ';
  // Whitespace-only document should return empty array
  const result = parser.parse(input);
  expect(result).toEqual([]);
});

test('TestEmptyLinksTest', () => {
  let input = '()';
  let result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
  
  // '(:)' is now forbidden
  input = '(:)';
  expect(() => parser.parse(input)).toThrow();
  
  input = '(id:)';
  result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});