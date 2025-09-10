import { test, expect } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { Link } from '../src/Link.js';

const parser = new Parser();

test('test_arrow_left_to_right_syntax', () => {
  const input = '1 → 2';
  const parsed = parser.parse(input);
  
  // Should parse as (1 2) - left points to right
  expect(parsed.length).toBe(1);
  expect(parsed[0].id).toBe(null);
  expect(parsed[0].values.length).toBe(2);
  expect(parsed[0].values[0].id).toBe('1');
  expect(parsed[0].values[1].id).toBe('2');
});

test('test_arrow_right_to_left_syntax', () => {
  const input = '2 ← 1';
  const parsed = parser.parse(input);
  
  // Should parse as (1 2) - right points to left becomes left points to right
  expect(parsed.length).toBe(1);
  expect(parsed[0].id).toBe(null);
  expect(parsed[0].values.length).toBe(2);
  expect(parsed[0].values[0].id).toBe('1');
  expect(parsed[0].values[1].id).toBe('2');
});

test('test_multiline_arrow_syntax', () => {
  const input = '(1 → 2)';
  const parsed = parser.parse(input);
  
  // Should parse as (1 2)
  expect(parsed.length).toBe(1);
  expect(parsed[0].id).toBe(null);
  expect(parsed[0].values.length).toBe(2);
  expect(parsed[0].values[0].id).toBe('1');
  expect(parsed[0].values[1].id).toBe('2');
});

test('test_multiline_arrow_left_syntax', () => {
  const input = '(2 ← 1)';
  const parsed = parser.parse(input);
  
  // Should parse as (1 2) - 2 ← 1 means 1 points to 2
  expect(parsed.length).toBe(1);
  expect(parsed[0].id).toBe(null);
  expect(parsed[0].values.length).toBe(2);
  expect(parsed[0].values[0].id).toBe('1');
  expect(parsed[0].values[1].id).toBe('2');
});

test('test_arrow_formatting_mode', () => {
  // Create a link programmatically and test arrow formatting
  const link = new Link(null, [new Link('1'), new Link('2')]);
  
  // Standard formatting
  const standard = link.format();
  expect(standard).toBe('(1 2)');
  
  // Arrow formatting mode
  const arrow = link.format(false, false, true);
  expect(arrow).toBe('1 → 2');
});

test('test_equivalence_of_expressions', () => {
  // Test that (2 ← 1) = (1 → 2) = (2 1) according to issue description
  const leftArrow = parser.parse('2 ← 1')[0];
  const rightArrow = parser.parse('1 → 2')[0];
  const standard = parser.parse('(1 2)')[0];
  
  // All should result in the same structure: values [1, 2]
  expect(leftArrow.values[0].id).toBe('1');
  expect(leftArrow.values[1].id).toBe('2');
  
  expect(rightArrow.values[0].id).toBe('1');
  expect(rightArrow.values[1].id).toBe('2');
  
  expect(standard.values[0].id).toBe('1');
  expect(standard.values[1].id).toBe('2');
});

test('test_quoted_references_with_arrows', () => {
  const input = '"hello world" → "foo bar"';
  const parsed = parser.parse(input);
  
  expect(parsed.length).toBe(1);
  expect(parsed[0].values[0].id).toBe('hello world');
  expect(parsed[0].values[1].id).toBe('foo bar');
});

test('test_mixed_arrow_and_standard_syntax', () => {
  // Test that arrow links can be used as components in larger expressions
  const arrowLink = new Link(null, [new Link('source'), new Link('target')]);
  const mixedLink = new Link('relationship', [arrowLink]);
  
  // Test standard formatting
  const standard = mixedLink.format();
  expect(standard).toBe('(relationship: (source target))');
  
  // Test arrow formatting
  const arrow = mixedLink.format(false, false, true);
  expect(arrow).toBe('(relationship: source → target)');
});