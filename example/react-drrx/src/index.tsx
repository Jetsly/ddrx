import { drrxReact } from 'drrx';
import * as React from 'react';
import App from './App';
const drrx = drrxReact();
drrx.model('aa', {
  state: {
    count: 33,
    isAuth: false,
    name: 'ddot',
  },
  mutations: {
    increment(state, { payload }) {
      state.count += 1;
    },
    decrement(state, { payload }) {
      state.count -= 1;
    },
  },
  actions: {
    ping({ commit }) {
      commit('increment');
    },
    fetchOK() {
      return 'fetchOK';
    },
    fetchErr() {
      throw new Error('fetchErr');
    },
  },
});
drrx.router(() => <App />);
drrx.start('#root');
setTimeout(() => {
  drrx.model('cc', {
    state: {
      count: 33,
      isAuth: false,
      name: 'ddot',
    },
    mutations: {
      increment(state, { payload }) {
        state.count += 1;
      },
      decrement(state, { payload }) {
        state.count -= 1;
      },
    },
  });
  console.log('load ed');
}, 3000);
