import invariant from 'invariant';
import * as isequal from 'lodash.isequal';
import * as React from 'react';
import { MODULENAME_SEP } from './internal/constants';
import createStore from './internal/createStore';
import { isFunction, isHTMLElement, isString } from './internal/utils';

const store = createStore();

function getProvider(app) {
  return extraProps =>
    app._router({ app, history: app._history, ...extraProps });
}

function render(container, app) {
  const ReactDOM = require('react-dom');
  ReactDOM.render(React.createElement(getProvider(app)), container);
}

export default function create(createOpt: { history? } = {}) {
  function router(config: ({ app, history }) => JSX.Element) {
    invariant(
      isFunction(config),
      `[app.router] router should be function, but got ${typeof config}`
    );
    app._router = config;
  }

  function start(container) {
    if (isString(container)) {
      container = document.querySelector(container);
      invariant(container, `[app.start] container ${container} not found`);
    }
    invariant(
      !container || isHTMLElement(container),
      `[app.start] container should be HTMLElement`
    );
    invariant(
      app._router,
      `[app.start] router must be registered before app.start()`
    );
    if (container) {
      render(container, app);
    } else {
      return getProvider(app);
    }
  }
  const app = {
    _router: null,
    _history: createOpt.history,
    start,
    router,
    model: store.registerModule,
    unmodel: store.unregisterModule,
    replaceModel: store.replaceModule,
  };
  return app;
}

const normalizeNamespace = fn => (module, map?) => {
  if (typeof module !== 'string') {
    map = module;
    module = '';
  } else if (module.charAt(module.length - 1) !== MODULENAME_SEP) {
    module += MODULENAME_SEP;
  }
  return fn(module, map);
};

const normalizeMap = map =>
  Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }));

const getNestedState = (state, path) =>
  path
    .split(MODULENAME_SEP)
    .filter(Boolean)
    .reduce((val, key) => val[key], state);

function getFieldValue(module, map) {
  return normalizeMap(map).reduce((preval, { key, val }) => {
    const state = getNestedState(store.getState, module);
    return {
      ...preval,
      [key]: isFunction(val) ? val(state) : getNestedState(state, val),
    };
  }, {});
}

export const useDrrx = normalizeNamespace((module, map?) => {
  const [state, setState] = React.useState(getFieldValue(module, map));
  React.useEffect(() => {
    const listen = store.subscribe(data => {
      const newValue = getFieldValue(module, map);
      if (!isequal(state, newValue)) {
        setState(newValue);
      }
    });
    return function cleanup() {
      listen.unsubscribe();
    };
  });
  const dispatch = store.dispatch;
  const commit = store.commit;
  return [state, dispatch, commit];
});
