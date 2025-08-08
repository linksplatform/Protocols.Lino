import { test, expect } from 'bun:test';
import { LinksGroup } from '../src/LinksGroup.js';
import { Link } from '../src/Link.js';

test('LinksGroup constructor', () => {
  const element = new Link('root');
  const children = [new Link('child1'), new Link('child2')];
  const group = new LinksGroup(element, children);
  
  expect(group.element).toBe(element);
  expect(group.children).toBe(children);
});

test('LinksGroup toList flattens structure', () => {
  const root = new Link('root');
  const child1 = new Link('child1');
  const child2 = new Link('child2');
  const grandchild = new Link('grandchild');
  
  const childGroup = new LinksGroup(child2, [grandchild]);
  const group = new LinksGroup(root, [child1, childGroup]);
  
  const list = group.toList();
  expect(list.length).toBe(4);
  expect(list[0]).toBe(root);
  expect(list[1]).toBe(child1);
  expect(list[2]).toBe(child2);
  expect(list[3]).toBe(grandchild);
});

test('LinksGroup toString', () => {
  const element = new Link('root');
  const children = [new Link('child1'), new Link('child2')];
  const group = new LinksGroup(element, children);
  
  const str = group.toString();
  expect(str).toContain('(root)');
  expect(str).toContain('(child1)');
  expect(str).toContain('(child2)');
});