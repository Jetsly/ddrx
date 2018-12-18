import createStore from '../createStore';

describe('createStore commit', () => {
  test('commit increment', done => {
    const store = createStore();
    store.registerModule('a', {
      state: {
        count: 0,
      },
      mutations: {
        increment(state) {
          state.count++;
        },
      },
    });
    store.commit('a/increment');
    store.commit({ type: 'a/increment' });
    store.subscribe(state => {
      expect(state).toEqual({ a: { count: 2 } });
      done();
    });
  });
  test('commit not exist', done => {
    const store = createStore();
    store.registerModule('a', {
      state: {
        count: 0,
      },
      mutations: {
        increment(state, count) {
          state.count = count;
        },
      },
    });
    store.commit('a/decrement');
    store.commit('a/increment', 3);
    store.subscribe(state => {
      expect(state).toEqual({ a: { count: 3 } });
      done();
    });
  });
});
