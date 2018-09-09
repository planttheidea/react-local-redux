// test
import test from 'ava';

// src
import * as helperMethods from 'src/helperMethods';

test('if createActionCreator will create an actionCreator with default handlers', (t) => {
  const type = 'type';
  const payloadHandler = undefined;
  const metaHandler = undefined;

  const actionCreator = helperMethods.createActionCreator(type, payloadHandler, metaHandler);

  t.is(typeof actionCreator, 'function');

  const actionType = actionCreator.toString();

  t.is(actionType, type);

  const args = ['payload', 'ignored'];

  const result = actionCreator(...args);

  t.deepEqual(result, {
    payload: args[0],
    type,
  });
});

test('if createActionCreator will create an actionCreator with default handlers that handles when the payload is undefined', (t) => {
  const type = 'type';
  const payloadHandler = () => {};
  const metaHandler = undefined;

  const actionCreator = helperMethods.createActionCreator(type, payloadHandler, metaHandler);

  t.is(typeof actionCreator, 'function');

  const actionType = actionCreator.toString();

  t.is(actionType, type);

  const args = [new Error('boom'), 'ignored'];

  const result = actionCreator(...args);

  t.deepEqual(result, {
    type,
  });
});

test('if createActionCreator will create an actionCreator with default handlers that handles an error', (t) => {
  const type = 'type';
  const payloadHandler = undefined;
  const metaHandler = undefined;

  const actionCreator = helperMethods.createActionCreator(type, payloadHandler, metaHandler);

  t.is(typeof actionCreator, 'function');

  const actionType = actionCreator.toString();

  t.is(actionType, type);

  const args = [new Error('boom'), 'ignored'];

  const result = actionCreator(...args);

  t.deepEqual(result, {
    isError: true,
    payload: args[0],
    type,
  });
});

test('if createActionCreator will create an actionCreator with custom handlers', (t) => {
  const type = 'type';
  const payloadHandler = (ignored, payload) => payload;
  const metaHandler = (meta) => meta;

  const actionCreator = helperMethods.createActionCreator(type, payloadHandler, metaHandler);

  t.is(typeof actionCreator, 'function');

  const actionType = actionCreator.toString();

  t.is(actionType, type);

  const args = ['payload', 'ignored'];

  const result = actionCreator(...args);

  t.deepEqual(result, {
    meta: args[0],
    payload: args[1],
    type,
  });
});

test('if createActionCreator throws an error when the type is not a string', (t) => {
  const type = {};
  const payloadHandler = () => {};
  const metaHandler = () => {};

  t.throws(() => {
    helperMethods.createActionCreator(type, payloadHandler, metaHandler);
  }, ReferenceError);
});

test('if createActionCreator throws an error when the payloadHandler is not a function', (t) => {
  const type = 'type';
  const payloadHandler = 'foo';
  const metaHandler = () => {};

  t.throws(() => {
    helperMethods.createActionCreator(type, payloadHandler, metaHandler);
  }, ReferenceError);
});

test('if createActionCreator throws an error when the metaHandler is not a function', (t) => {
  const type = 'type';
  const payloadHandler = () => {};
  const metaHandler = 'foo';

  t.throws(() => {
    helperMethods.createActionCreator(type, payloadHandler, metaHandler);
  }, ReferenceError);
});

test('if createReducer will create a reducer based on the handlers passed', (t) => {
  const handlers = {
    type: (state) => ({
      ...state,
      extra: 'stuff',
    }),
  };
  const initialState = {
    existing: 'stuff',
  };

  const reducer = helperMethods.createReducer(handlers, initialState);

  t.is(typeof reducer, 'function');

  const changeResult = reducer(initialState, {type: 'type'});

  t.deepEqual(changeResult, {
    ...initialState,
    extra: 'stuff',
  });

  const noChangeResult = reducer(initialState, {});

  t.is(noChangeResult, initialState);
});

test('if createReducer will create a reducer based on the handlers passed with default initialState', (t) => {
  const handlers = {
    type: (state) => ({
      ...state,
      extra: 'stuff',
    }),
  };
  const initialState = undefined;

  const reducer = helperMethods.createReducer(handlers, initialState);

  t.is(typeof reducer, 'function');

  const changeResult = reducer(initialState, {type: 'type'});

  t.deepEqual(changeResult, {
    extra: 'stuff',
  });

  const noChangeResult = reducer(initialState, {});

  t.deepEqual(noChangeResult, {});
});

test('if createReducer will return the handlers passed if already a function', (t) => {
  const handlers = () => {};
  const initialState = undefined;

  const result = helperMethods.createReducer(handlers, initialState);

  t.is(result, handlers);
});

test('if createReducer will throw an error when handlers is not a function nor an object', (t) => {
  const handlers = 'foo';
  const initialState = {};

  t.throws(() => {
    helperMethods.createReducer(handlers, initialState);
  }, ReferenceError);
});
