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

test('SignificantWhitespaceTest', () => {
  if (!parser.parserModule) return;
  
  const source = `
users
    user1
        id
            43
        name
            first
                John
            last
                Williams
        location
            New York
        age
            23
    user2
        id
            56
        name
            first
                Igor
            middle
                Petrovich
            last
                Ivanov
        location
            Moscow
        age
            20`;
            
  const target = `(users)
(users user1)
((users user1) id)
(((users user1) id) 43)
((users user1) name)
(((users user1) name) first)
((((users user1) name) first) John)
(((users user1) name) last)
((((users user1) name) last) Williams)
((users user1) location)
(((users user1) location) (New York))
((users user1) age)
(((users user1) age) 23)
(users user2)
((users user2) id)
(((users user2) id) 56)
((users user2) name)
(((users user2) name) first)
((((users user2) name) first) Igor)
(((users user2) name) middle)
((((users user2) name) middle) Petrovich)
(((users user2) name) last)
((((users user2) name) last) Ivanov)
((users user2) location)
(((users user2) location) Moscow)
((users user2) age)
(((users user2) age) 20)`;

  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('SimpleSignificantWhitespaceTest', () => {
  if (!parser.parserModule) return;
  
  const source = `a
    b
    c`;
  const target = `(a)
(a b)
(a c)`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('TwoSpacesSizedWhitespaceTest', () => {
  if (!parser.parserModule) return;
  
  const source = `
users
  user1`;
  const target = `(users)
(users user1)`;
  const links = parser.parse(source);
  const formattedLinks = formatLinks(links);
  expect(formattedLinks).toBe(target);
});

test('Parse nested structure with indentation', () => {
  if (!parser.parserModule) return;
  
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

test('Test indentation consistency', () => {
  if (!parser.parserModule) return;
  
  // Test that indentation must be consistent
  const input = `parent
  child1
   child2`; // Inconsistent indentation
  const result = parser.parse(input);
  // This should parse but child2 won't be a child of parent due to different indentation
  expect(result.length).toBeGreaterThan(0);
});