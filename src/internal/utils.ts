import * as isObject from 'is-plain-object';
import { mName } from './Identifier';
export const isPlainObject = isObject;
export const isString = o => typeof o === 'string';
export const isArray = o => Array.isArray(o);
export const isFunction = o => typeof o === 'function';
export const isAllFunction = o =>
  Object.keys(o).every(key => isFunction(o[key]));
export const isHTMLElement = o =>
  typeof o === 'object' && o !== null && o.nodeType && o.nodeName;

export const statePath: (name: mName) => string[] = name =>
  (isArray(name) ? name : [name]) as string[];
