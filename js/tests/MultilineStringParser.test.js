import { test, expect } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { formatLinks } from '../src/Link.js';

const parser = new Parser();

test('MultilineDoubleQuotedStringTest', () => {
  const source = `("long
string literal representing
the reference")`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe(null);
  expect(links[0].values.length).toBe(1);
  expect(links[0].values[0].id).toBe("long\nstring literal representing\nthe reference");
});

test('MultilineSingleQuotedStringTest', () => {
  const source = `('another
long string literal 
as another reference')`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe(null);
  expect(links[0].values.length).toBe(1);
  expect(links[0].values[0].id).toBe("another\nlong string literal \nas another reference");
});

test('Issue53ExampleTest', () => {
  // Test the exact example from issue #53
  const source = `(
  "long
string literal representing
the reference"
  
  'another
long string literal 
as another reference'
)`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe(null);
  expect(links[0].values.length).toBe(2);
  expect(links[0].values[0].id).toBe("long\nstring literal representing\nthe reference");
  expect(links[0].values[1].id).toBe("another\nlong string literal \nas another reference");
});

test('MultilineStringWithIdTest', () => {
  const source = `(myId: "first
multiline
value" 'second
multiline
value')`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe('myId');
  expect(links[0].values.length).toBe(2);
  expect(links[0].values[0].id).toBe("first\nmultiline\nvalue");
  expect(links[0].values[1].id).toBe("second\nmultiline\nvalue");
});

test('MixedSingleAndMultilineStringTest', () => {
  const source = `(normal "multi
line" single)`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe(null);
  expect(links[0].values.length).toBe(3);
  expect(links[0].values[0].id).toBe("normal");
  expect(links[0].values[1].id).toBe("multi\nline");
  expect(links[0].values[2].id).toBe("single");
});

test('SingleCharacterMultilineStringTest', () => {
  const source = `("a")`;
  const links = parser.parse(source);
  expect(links.length).toBe(1);
  expect(links[0].id).toBe(null);
  expect(links[0].values.length).toBe(1);
  expect(links[0].values[0].id).toBe("a");
});