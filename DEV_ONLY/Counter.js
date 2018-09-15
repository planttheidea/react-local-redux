// external dependencies
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// store
import {
  connectLocal,
  createActionCreator,
  createReducer,
} from '../src';

// const INITIAL_STATE = (() => {
//   const defaultState = {count: 0};

//   try {
//     return JSON.parse(sessionStorage.getItem('state')) || defaultState;
//   } catch (error) {
//     return defaultState;
//   }
// })();

const INITIAL_STATE = {count: 0};

const actionCreators = {
  decrement: createActionCreator('DECREMENT'),
  increment: () => ({type: 'INCREMENT'}),
  incrementByTen: () => async (dispatch, getState) => {
    for (let index = 0; index < 10; index++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log(getState());

      dispatch(actionCreators.increment());
    }
  },
  reset: createActionCreator('RESET'),
};

// const reducer = (state = INITIAL_STATE, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return {
//         ...state,
//         count: state.count + 1,
//       };

//     case 'DECREMENT':
//       return {
//         ...state,
//         count: state.count - 1,
//       };

//     default:
//       return state;
//   }
// };

const reducer = createReducer(
  {
    [actionCreators.decrement]: (state) => ({
      ...state,
      count: state.count - 1,
    }),
    INCREMENT: (state) => ({
      ...state,
      count: state.count + 1,
    }),
    RESET: (state) => ({
      ...state,
      count: 0,
    }),
  },
  INITIAL_STATE
);

let instanceCount = 1;

const sessionStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const update = () => sessionStorage.setItem('state', JSON.stringify(store.getState()));

  if (result.then) {
    result.then(update);
  } else {
    update();
  }

  return result;
};

const options = {
  enhancer: (defaultEnhancer) =>
    // eslint-disable-next-line rapid7/no-trailing-underscore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: `Counter (${instanceCount++})`,
    })(defaultEnhancer),
  middlewares: [sessionStorageMiddleware, thunk, logger],
};

class Counter extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    decrement: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired,
    incrementByTen: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  render() {
    const {count, decrement, increment, incrementByTen, reset} = this.props;

    return (
      <div>
        <div style={{marginBottom: 15}}>Count: {count}</div>

        <button onClick={decrement}>Decrement</button>
        <button onClick={increment}>Increment</button>
        <button onClick={incrementByTen}>Increment by ten</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }
}

export default connectLocal(reducer, actionCreators, options)(Counter);
