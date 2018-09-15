// test
import test from 'ava';
import {mount} from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import * as redux from 'redux';
import thunk from 'redux-thunk';

// src
import * as connect from 'src/connectLocal';
import {DEFAULT_OPTIONS} from 'src/constants';

test('if createGetState will create a method that returns the synchronous state', (t) => {
  const instance = {
    __state: {},
  };

  const result = connect.createGetState(instance)();

  t.is(result, instance.__state);
});

test('if createShouldComponentUpdate will return true if not pure', (t) => {
  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
      pure: false,
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
  };
  const nextState = {
    ...instance.state,
  };
  const nextContext = {
    ...instance.context,
  };

  t.true(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createShouldComponentUpdate will return false if pure and nothing changed', (t) => {
  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
  };
  const nextState = {
    ...instance.state,
  };
  const nextContext = {
    ...instance.context,
  };

  t.false(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createShouldComponentUpdate will return true if pure and ownProps changed', (t) => {
  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
    newProp: 'value',
  };
  const nextState = {
    ...instance.state,
  };
  const nextContext = {
    ...instance.context,
  };

  t.true(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createShouldComponentUpdate will return true if pur`e` and state changed', (t) => {
  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
  };
  const nextState = {
    ...instance.state,
    newState: 'value',
  };
  const nextContext = {
    ...instance.context,
  };

  t.true(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createShouldComponentUpdate will return true if pure and context changed', (t) => {
  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
  };
  const nextState = {
    ...instance.state,
  };
  const nextContext = {
    ...instance.context,
    newContext: 'value',
  };

  t.true(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createShouldComponentUpdate will return true if pure and mergedProps changed', (t) => {
  let count = 0;

  const instance = {
    actionCreators: {},
    context: {},
    options: {
      ...DEFAULT_OPTIONS,
      mergeProps(state, actionCreators, props) {
        count++;

        return count;
      },
    },
    props: {},
    state: {},
  };

  const nextProps = {
    ...instance.props,
  };
  const nextState = {
    ...instance.state,
  };
  const nextContext = {
    ...instance.context,
  };

  t.true(connect.createShouldComponentUpdate(instance)(nextProps, nextState, nextContext));
});

test('if createComponentWillUnmount will create a method that unsubscribes from the store and kill it', (t) => {
  const instance = {
    __store: {},
    __unsubscribe: sinon.spy(),
  };

  connect.createComponentWillUnmount(instance)();

  t.true(instance.__unsubscribe.calledOnce);
  t.is(instance.__store, null);
});

test('if getActionCreators gets the actionCreators wrapped in dispatch', (t) => {
  const actionCreators = {
    fn: sinon.stub().returnsArg(0),
  };
  const dispatch = sinon.stub().returnsArg(0);

  const result = connect.getActionCreators(actionCreators, dispatch);

  t.is(typeof result, 'object');
  t.deepEqual(Object.keys(result), ['fn']);

  const args = ['foo', 123, {}];

  result.fn(...args);

  t.true(actionCreators.fn.calledOnce);
  t.true(actionCreators.fn.calledWith(...args));

  t.true(dispatch.calledOnce);
  t.true(dispatch.calledWith(args[0]));
});

test('if onConstruct will assign the appropriate instance values', (t) => {
  const resultingState = {
    state: 'value',
  };

  const instance = {};

  const reducer = (state, action) => {
    t.is(state, undefined);
    t.is(typeof action.type, 'string');

    return resultingState;
  };

  const actions = {
    fn: sinon.stub().returnsArg(0),
  };

  connect.onConstruct(instance, reducer, actions);

  const {
    actionCreators,
    componentWillUnmount,
    getState,
    shouldComponentUpdate,
    __store,
    __unsubscribe,
    ...rest
  } = instance;

  const fakeStore = redux.createStore(reducer);

  t.deepEqual(Object.keys(__store), Object.keys(fakeStore));
  Object.keys(fakeStore).forEach((key) => {
    t.is(typeof __store[key], 'function');
  });

  t.is(typeof __unsubscribe, 'function');

  t.deepEqual(rest, {
    options: DEFAULT_OPTIONS,
    state: resultingState,
  });

  Object.keys(actionCreators).forEach((fn) => {
    t.is(typeof actionCreators[fn], 'function');
  });

  t.is(typeof componentWillUnmount, 'function');
  t.is(typeof getState, 'function');
  t.is(typeof shouldComponentUpdate, 'function');
});

test('if onConstruct will assign the appropriate instance values with custom options', (t) => {
  const resultingState = {
    state: 'value',
  };

  const instance = {};

  const reducer = (state, action) => {
    t.is(state, undefined);
    t.is(typeof action.type, 'string');

    return resultingState;
  };

  const actions = {
    fn: sinon.stub().returnsArg(0),
  };

  const options = {
    enhancer: sinon.stub().returnsArg(0),
    middlewares: [thunk],
    pure: false,
  };

  const applyMiddlewareSpy = sinon.spy(redux, 'applyMiddleware');

  connect.onConstruct(instance, reducer, actions, options);

  t.true(applyMiddlewareSpy.calledOnce);
  t.true(applyMiddlewareSpy.calledWith(...options.middlewares));

  applyMiddlewareSpy.restore();

  t.true(options.enhancer.calledOnce);

  const {
    actionCreators,
    componentWillUnmount,
    getState,
    shouldComponentUpdate,
    __store,
    __unsubscribe,
    ...rest
  } = instance;

  const fakeStore = redux.createStore(reducer);

  t.deepEqual(Object.keys(__store), Object.keys(fakeStore));
  Object.keys(fakeStore).forEach((key) => {
    t.is(typeof __store[key], 'function');
  });

  t.is(typeof __unsubscribe, 'function');

  t.deepEqual(rest, {
    options: {
      ...DEFAULT_OPTIONS,
      pure: false,
    },
    state: resultingState,
  });

  Object.keys(actionCreators).forEach((fn) => {
    t.is(typeof actionCreators[fn], 'function');
  });

  t.is(typeof componentWillUnmount, 'function');
  t.is(typeof getState, 'function');
  t.is(typeof shouldComponentUpdate, 'function');
});

test('if onConstruct will assign the appropriate instance values when there are no actionCreators passed', (t) => {
  const resultingState = {
    state: 'value',
  };

  const instance = {};

  const reducer = (state, action) => {
    t.is(state, undefined);
    t.is(typeof action.type, 'string');

    return resultingState;
  };

  connect.onConstruct(instance, reducer, undefined, DEFAULT_OPTIONS);

  const {
    actionCreators,
    componentWillUnmount,
    getState,
    shouldComponentUpdate,
    __store,
    __unsubscribe,
    ...rest
  } = instance;

  const fakeStore = redux.createStore(reducer);

  t.deepEqual(Object.keys(__store), Object.keys(fakeStore));
  Object.keys(fakeStore).forEach((key) => {
    t.is(typeof __store[key], 'function');
  });

  t.is(typeof __unsubscribe, 'function');

  t.deepEqual(rest, {
    options: DEFAULT_OPTIONS,
    state: resultingState,
  });

  Object.keys(actionCreators).forEach((fn) => {
    t.is(typeof actionCreators[fn], 'function');
  });

  t.deepEqual(Object.keys(actionCreators), ['dispatch']);

  t.is(typeof actionCreators.dispatch, 'function');

  t.is(typeof componentWillUnmount, 'function');
  t.is(typeof getState, 'function');
  t.is(typeof shouldComponentUpdate, 'function');
});

test('if connectLocal will create a wrapped component with the merged props', (t) => {
  const initialState = {
    existing: 'stuff',
  };

  const reducer = (state = initialState, action) => {
    if (action.type === 'type') {
      return {
        ...state,
        added: 'stuff',
      };
    }

    return state;
  };

  const actionCreators = {
    addStuff: () => ({type: 'type'}),
  };

  const Component = sinon.stub().callsFake(({addStuff, ...props}) => <div />);

  const WrappedComponent = connect.connectLocal(reducer, actionCreators)(Component);

  t.is(typeof WrappedComponent, 'function');

  const wrapper = mount(<WrappedComponent own="prop" />);

  const {addStuff, ...initialProps} = wrapper.find(Component).props();

  t.is(typeof addStuff, 'function');
  t.deepEqual(initialProps, {
    existing: 'stuff',
    own: 'prop',
  });

  addStuff();

  wrapper.update();

  const {addStuff: ignored, ...updatedProps} = wrapper.find(Component).props();

  t.deepEqual(updatedProps, {
    ...initialProps,
    added: 'stuff',
  });
});
