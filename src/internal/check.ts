import * as dlv from 'dlv';
import * as invariant from 'invariant';
import { MODULENAME_SEP } from './constants';
import { IModule, IModules, mName } from './Identifier';
import { isAllFunction, isPlainObject, statePath } from './utils';

export const checkModules = (modules: IModules) => {
  invariant(
    isPlainObject(modules),
    `modules should be plain object, but got ${typeof modules}`
  );
};

export const checkModule = (model: IModule) => {
  const { state, mutations, actions } = model;
  invariant(
    isPlainObject(model),
    `model should be plain object, but got ${typeof model}`
  );
  if (mutations) {
    invariant(
      isPlainObject(mutations),
      `mutation should be plain object, but got ${typeof mutations}`
    );
    invariant(isAllFunction(mutations), `mutation should be all function`);

    invariant(
      state !== undefined,
      `state should be exist, because hav mutations operation`
    );
  }
  if (actions) {
    invariant(
      isPlainObject(actions),
      `actions should be plain object, but got ${typeof actions}`
    );
    invariant(isAllFunction(actions), `actions should be all function`);
  }
};

export const checkUniq = (modules, path) => {
  invariant(
    dlv(modules, path) === undefined,
    `model path should be uniq, but got ${path} exist, if replace need unregister before`
  );
};

export const checkType = (type: string) => {
  invariant(
    type.split(MODULENAME_SEP).length === 2,
    `type should be hav module name, but got ${type}`
  );
};

export const checkStatePath = (name: mName) => {
  const dlvPath = statePath(name);
  invariant(
    dlvPath.length === 1,
    `moduleName don't support nested, but got ${dlvPath.length}`
  );
  dlvPath.forEach(path =>
    invariant(
      /^[a-z]+$/i.test(path),
      `moduleName should be [a-z], but got ${path}`
    )
  );
  return dlvPath;
};
