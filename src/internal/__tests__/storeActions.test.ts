import createStore from '../createStore';

describe('createStore actions', () => {
  test('actions increment', done => {
    const store = createStore();
    store.registerModule('a', {
      actions: {
        increment({ }, count) {
          return count;
        },
      },
    });
    store.dispatch('a/increment', 10).then(a => {
      expect(a).toEqual(10);
      done();
    });
  });
  test('actions get state ', done => {
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
      actions: {
        get({ state }) {
          return state.a.count;
        },
      },
    });
    store.dispatch('a/get').then(a => {
      expect(a).toEqual(11);
      done();
    });
    store.commit('a/increment', 11);
  });
  test('actions get state ', done => {
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
      actions: {
        set({ commit }) {
          return commit('increment', 10);
        },
      },
    });
    store.dispatch('a/set').then(a => {
      store.subscribe(state => {
        expect(state.a.count).toEqual(10);
        done();
      });
    });
  });
});
