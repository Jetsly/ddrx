import {
  isAllFunction,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  statePath,
} from '../utils';

test('isPlainObject', () => {
  expect(isPlainObject({})).toBe(true);
  expect(isPlainObject([])).toBe(false);
});

test('isString', () => {
  expect(isString('')).toBe(true);
  expect(isString({ namespace: 222 })).toBe(false);
});

test('isArray', () => {
  expect(isArray([])).toBe(true);
  expect(isArray({ namespace: 222 })).toBe(false);
});

test('isFunction', () => {
  expect(isFunction(() => null)).toBe(true);
  expect(isFunction({ namespace: 222 })).toBe(false);
});

test('isAllFunction', () => {
  expect(isAllFunction({ a: () => null })).toBe(true);
  expect(isAllFunction({ a: 's' })).toBe(false);
});

test('statePath', () => {
  expect(statePath('aaa')).toEqual(['aaa']);
  expect(statePath(['a', 'c'])).toEqual(['a', 'c']);
});
