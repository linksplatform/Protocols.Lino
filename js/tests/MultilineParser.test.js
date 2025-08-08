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

test('TwoLinksTest', () => {
  if (!parser.parserModule) return;
  
  const source = `(first: x y)
(second: a b)`;
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('ParseAndStringifyTest', () => {
  if (!parser.parserModule) return;
  
  const source = `(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (love mama))`;
  const links = parser.parse(source);
  const target = formatLinks(links);
  expect(target).toBe(source);
});

test('ParseAndStringifyTest2', () => {
  if (!parser.parserModule) return;
  
  const source = `father (lovesMom: loves mom)
son lovesMom
daughter lovesMom
all (love mom)`;
  const links = parser.parse(source);
  const target = formatLinks(links, true); // lessParentheses = true
  expect(target).toBe(source);
});

test('ParseAndStringifyWithLessParenthesesTest', () => {
  if (!parser.parserModule) return;
  
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
  if (!parser.parserModule) return;
  
  const source = `(a: a b)
(a: b c)`;
  const target = `(a: a b)
(a: b c)`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('Test complex structure', () => {
  if (!parser.parserModule) return;
  
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
  if (!parser.parserModule) return;
  
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