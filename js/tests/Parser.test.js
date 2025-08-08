import { test, expect, beforeAll } from 'bun:test';
import { Parser } from '../src/Parser.js';
import { Link } from '../src/Link.js';

let parser;

beforeAll(async () => {
  // Note: These tests will only work after running 'bun run build:grammar'
  parser = new Parser();
  try {
    await parser.initialize();
  } catch (error) {
    console.warn('Parser not initialized. Run: bun run build:grammar');
  }
});

test('Parse simple reference', () => {
  if (!parser.parserModule) {
    return; // Skip if parser not compiled
  }
  
  const input = 'test';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('test');
  expect(result[0].values).toEqual([]);
});

test('Parse reference with colon and values', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = 'parent: child1 child2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('child1');
  expect(result[0].values[1].id).toBe('child2');
});

test('Parse multiline link', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = '(parent: child1 child2)';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('parent');
  expect(result[0].values.length).toBe(2);
});

test('Parse nested structure with indentation', () => {
  if (!parser.parserModule) {
    return;
  }
  
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

test('Parse quoted references', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = `"has space" 'has:colon'`;
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('has space');
  expect(result[0].values[1].id).toBe('has:colon');
});

test('Parse values only', () => {
  if (!parser.parserModule) {
    return;
  }
  
  const input = ': value1 value2';
  const result = parser.parse(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe(null);
  expect(result[0].values.length).toBe(2);
  expect(result[0].values[0].id).toBe('value1');
  expect(result[0].values[1].id).toBe('value2');
});