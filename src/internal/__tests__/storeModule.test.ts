import createStore from '../createStore';

describe('createStore module', () => {
  test('initial module', done => {
    const store = createStore({
      modules: {
        a: {
          state: 'aa',
        },
        b: {
          state: 'bb',
        },
      },
    });
    store.subscribe(state => {
      expect(state).toEqual({ a: 'aa', b: 'bb' });
      done();
    });
  });
  test('register withour module', done => {
    const store = createStore();
    store.registerModule('b', {});
    store.subscribe(state => {
      expect(state).toEqual({});
      done();
    });
  });
  test('register module uniq', () => {
    const store = createStore();
    store.registerModule('a', { state: 'a' });
    expect(() => store.registerModule('a', { state: 'a' })).toThrow();
  });
  test('register module', done => {
    const store = createStore({
      modules: {
        a: {
          state: 'aa',
        },
      },
    });
    store.registerModule('b', { state: 'bb' });
    store.subscribe(state => {
      expect(state).toEqual({ a: 'aa', b: 'bb' });
      done();
    });
  });
  test('unregister module', done => {
    const store = createStore({
      modules: {
        a: {
          state: 'aa',
        },
        b: {
          state: 'bb',
        },
      },
    });
    store.unregisterModule('b');
    store.subscribe(state => {
      expect(state).toEqual({ a: 'aa' });
      done();
    });
  });
  test('replace module', done => {
    const store = createStore({
      modules: {
        a: {
          state: 'aa',
        },
      },
    });
    store.replaceModule('a', { state: 'bb' });
    store.subscribe(state => {
      expect(state).toEqual({ a: 'bb' });
      done();
    });
  });
});
