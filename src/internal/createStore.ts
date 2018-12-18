import * as dlv from 'dlv';
import * as dsetModule from 'dset';
import produce from 'immer';
import * as invariant from 'invariant';
import * as cloneDeep from 'lodash.clonedeep';
import {
  asapScheduler,
  BehaviorSubject,
  queueScheduler,
  Subject,
  Subscription,
} from 'rxjs';
import { map, observeOn } from 'rxjs/operators';
import * as warning from 'warning';
import {
  checkModule,
  checkModules,
  checkStatePath,
  checkType,
  checkUniq,
} from './check';
import { MODULENAME_SEP } from './constants';
import { IModule, IStoreOps, mName } from './Identifier';
import { isFunction, isPlainObject } from './utils';
const dset = dsetModule.default || dsetModule;
const set = (obj, path, val) => {
  dset(obj, path, val);
  return obj;
};

const getParams = params => {
  const [mname, path, obj] = params;
  // tslint:disable-next-line:prefer-const
  let { type, ...rest } = typeof path === 'string' ? { type: path } : path;
  if (type.indexOf(MODULENAME_SEP) === -1 && mname) {
    type = [mname, type].join(MODULENAME_SEP);
  }
  const payload = typeof path === 'string' ? obj : rest;
  checkType(type);
  return [type, payload];
};

export default function createStore<T = any>(storeOps: IStoreOps = {}) {
  const state$ = new BehaviorSubject({});
  const mutation$ = {};
  const actions$ = {};
  const { modules } = storeOps;
  if (modules) {
    checkModules(modules);
    Object.keys(modules).forEach(name => registerModule(name, modules[name]));
  }

  function subscribe(
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return state$
      .pipe(observeOn(queueScheduler))
      .subscribe(next, error, complete);
  }

  function registerModule(name: mName, model: IModule) {
    checkModule(model);
    const { state, mutations, actions } = model;
    const curState = state$.getValue();
    const dlvPath = checkStatePath(name);
    checkUniq(curState, dlvPath);
    if (state) {
      state$.next(set(curState, dlvPath, cloneDeep(state)));
      if (mutations) {
        dset(mutation$, dlvPath, mutations);
      }
    }
    if (actions) {
      dset(actions$, dlvPath, actions);
    }
  }

  function unregisterModule(name: mName) {
    const dlvPath = checkStatePath(name);
    state$.next(set(state$.getValue(), dlvPath, undefined));
    dset(mutation$, dlvPath, undefined);
    dset(actions$, dlvPath, undefined);
  }

  function replaceModule(name: mName, model: IModule) {
    unregisterModule(name);
    registerModule(name, model);
  }

  function commit(...rest) {
    const [type, payload = {}] = getParams(rest);
    const [mname, mutation] = type.split(MODULENAME_SEP);
    const curState = state$.getValue();
    const dlvPath = checkStatePath(mname);
    const dState = dlv(curState, dlvPath);
    const handle = dlv(mutation$, dlvPath, {})[mutation];
    invariant(
      isPlainObject(dState),
      `commit ${mutation} should be register state before`
    );
    warning(isFunction(handle), `mutation should be function, but not found`);
    state$.next(
      set(
        curState,
        dlvPath,
        produce(dState, draft => {
          (handle || (() => null))(draft, payload);
        })
      )
    );
  }

  function dispatch(...rest) {
    const [type, payload = {}] = getParams(rest);
    const [mname, action] = type.split(MODULENAME_SEP);
    const dlvPath = checkStatePath(mname);
    const handle = dlv(actions$, dlvPath, {})[action];
    warning(isFunction(handle), `action should be function, but not found`);
    return new Promise((resolve, reject) => {
      const actionsSubject = new Subject();
      const actionHandle = handle || (() => null);
      actionsSubject
        .pipe(
          observeOn(asapScheduler),
          map(
            actionHandle.bind(null, {
              commit: commit.bind(null, mname),
              dispatch: dispatch.bind(null, mname),
              state: state$.getValue(),
            })
          )
        )
        .subscribe(resolve, reject);
      actionsSubject.next(payload);
      actionsSubject.complete();
    });
  }

  return {
    get getState() {
      return state$.getValue();
    },
    subscribe,
    /** model */
    registerModule,
    replaceModule,
    unregisterModule,
    /** handle */
    commit: commit.bind(null, ''),
    dispatch: dispatch.bind(null, ''),
  };
}
