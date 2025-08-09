import { test, expect } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { formatLinks } from '../src/Link.js';

const parser = new Parser();

test('TwoLinksTest', () => {
  const source = `(first: x y)
(second: a b)`;
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('ParseAndStringifyTest', () => {
  const source = `(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (love mama))`;
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('ParseAndStringifyTest2', () => {
  const source = `father (lovesMom: loves mom)
son lovesMom
daughter lovesMom
all (love mom)`;
  const links = parser.parse(source);
  const target = formatLinks(links, true); // lessParentheses = true
  expect(target).toBe(source);
});

test('ParseAndStringifyWithLessParenthesesTest', () => {
  const source = `lovesMama: loves mama
papa lovesMama
son lovesMama
daughter lovesMama
all (love mama)`;
  const links = parser.parse(source);
  const target = formatLinks(links, true); // lessParentheses = true
  expect(target).toBe(source);
});

test('DuplicateIdentifiersTest', () => {
  const source = `(a: a b)
(a: b c)`;
  const target = `(a: a b)
(a: b c)`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('Test complex structure', () => {
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

test('Test multiline with id', () => {
  // Test multi-line link with id
  const input = "(id: value1 value2)";
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});

test('Test multiple top level elements', () => {
  // Test multiple top-level elements
  const input = "(elem1: val1)\n(elem2: val2)";
  const result = parser.parse(input);
  expect(result.length).toBeGreaterThan(0);
});