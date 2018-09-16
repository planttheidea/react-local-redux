// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if identity will return the first argument passed', (t) => {
  const args = ['foo', 123, {}];

  const result = utils.identity(...args);

  t.is(result, args[0]);
});

test('if noop will return undefined', (t) => {
  const args = ['foo', 123, {}];

  const result = utils.noop(...args);

  t.is(result, undefined);
});

test('if reduce will work the same way as the native reduce', (t) => {
  const array = [1, 2, 3, 4, 5, 6];
  const fn = (sum, value) => sum + value;
  const initialValue = 0;

  const result = utils.reduce(array, fn, initialValue);

  t.is(result, array.reduce(fn, initialValue));
});

test('if assign will work the same way as the native assign', (t) => {
  const source1 = {foo: 'bar'};
  const source2 = undefined;
  const source3 = {bar: 'baz'};

  const result = utils.assign({}, source1, source2, source3);

  t.deepEqual(result, Object.assign({}, source1, source2, source3));
});

test('if getActionCreators gets the actionCreators wrapped in dispatch when an object', (t) => {
  const actionCreators = {
    fn: sinon.stub().returnsArg(0),
  };
  const dispatch = sinon.stub().returnsArg(0);
  const ownProps = {};

  const result = utils.getActionCreators(actionCreators, dispatch, ownProps);

  t.is(typeof result, 'object');
  t.deepEqual(Object.keys(result), ['fn']);

  const args = ['foo', 123, {}];

  result.fn(...args);

  t.true(actionCreators.fn.calledOnce);
  t.true(actionCreators.fn.calledWith(...args));

  t.true(dispatch.calledOnce);
  t.true(dispatch.calledWith(args[0]));
});

test('if getActionCreators will call actionCreators with dispatch and the component props when a function', (t) => {
  const actions = {};

  const actionCreators = sinon.stub().returns(actions);
  const dispatch = () => {};
  const ownProps = {};

  const result = utils.getActionCreators(actionCreators, dispatch, ownProps);

  t.true(actionCreators.calledOnce);
  t.true(actionCreators.calledWith(dispatch, ownProps));

  t.is(result, actions);
});

test('if getFunctionNameRegexp will get the name of the function when it exists', (t) => {
  function foo() {}

  const result = utils.getFunctionNameRegexp(foo);

  t.is(result, 'foo');
});

test('if getFunctionNameRegexp will return undefined when the name of the function does not exist', (t) => {
  const result = utils.getFunctionNameRegexp(() => {});

  t.is(result, undefined);
});

test('if getDisplayName will return the displayName when it exists', (t) => {
  function Comp() {}

  Comp.displayName = 'displayName';

  const result = utils.getDisplayName(Comp);

  t.is(result, Comp.displayName);
});

test('if getDisplayName will return the function name when it exists', (t) => {
  function Comp() {}

  const result = utils.getDisplayName(Comp);

  t.is(result, Comp.name);
});

test('if getDisplayName will return the derived function name when it exists', (t) => {
  function Comp() {}

  delete Comp.name;

  const result = utils.getDisplayName(Comp);

  t.is(result, 'Comp');
});

test('if getDisplayName will return a fallback value when the name cannot be derived', (t) => {
  const result = utils.getDisplayName(() => {});

  t.is(result, 'Component');
});

test('if getMergedProps will return the merged props objects', (t) => {
  const stateProps = {
    state: 'props',
  };
  const dispatchProps = {
    dispatch: 'props',
  };
  const ownProps = {
    own: 'props',
  };

  const result = utils.getMergedProps(stateProps, dispatchProps, ownProps);

  t.deepEqual(result, {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  });
});
