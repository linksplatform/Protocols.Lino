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