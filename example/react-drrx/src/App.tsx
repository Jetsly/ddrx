import { useDrrx } from 'drrx';
import * as React from 'react';

function Header(){
  const [store, dispatch, commit] = useDrrx({
    name: state => state.cc.name,
    count: state => state.cc.count,
  });
  return (
    <div>
      <p>{store.name} name</p>
      <p>{store.count} times</p>
      <button onClick={() => commit({ type: 'cc/increment' })}>increment</button>
    </div>
  );
}

export default function App() {
  const [store, dispatch, commit] = useDrrx('aa', ['count', 'isAuth', 'name']);
  const handleFetch = type => () => {
    dispatch({ type: 'aa/' + type, payload: { a: 'c' } }).then(
      a => {
        console.log(a, 'succ');
      },
      a => {
        console.log(a, 'err');
      }
    );
  };
  return (
    <div>
      <p>{store.isAuth} isAuth</p>
      <p>{store.name} name</p>
      <p>{store.count}</p>
      {store.count > 35 ? <Header /> : null}
      <button onClick={() => commit({ type: 'aa/increment' })}>
        increment
      </button>
      <button onClick={() => commit({ type: 'aa/decrement' })}>
        decrement
      </button>
      <button onClick={() => dispatch({ type: 'aa/ping' })}>ping</button>
      <br />
      <button onClick={handleFetch('fetchErr')}>fetch Err</button>
      <button onClick={handleFetch('fetchOK')}>fetch ok</button>
    </div>
  );
}
