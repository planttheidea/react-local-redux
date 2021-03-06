const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @function identity
 *
 * @description
 * return the first value passed
 *
 * @param {any} value the value to return
 * @returns {any} the first parameter passed
 */
export const identity = (value) => value;

/**
 * @function isUndefined
 *
 * @description
 * is the value passed undefined
 *
 * @param {any} value the value to test
 * @returns {boolean} is the value passed undefined
 */
export const isUndefined = (value) => value === void 0;

/**
 * @function keys
 *
 * @description
 * get the keys of the object (faster than Object.keys())
 *
 * @param {Object} object the object to get the keys from
 * @returns {Array<string>} the keys of the object
 */
export const keys = (object) => {
  const objectKeys = [];

  for (let key in object) {
    if (hasOwnProperty.call(object, key)) {
      objectKeys.push(key);
    }
  }

  return objectKeys;
};

/**
 * @function noop
 *
 * @description
 * return nothing regardless of what is passed
 *
 * @returns {void}
 */
export const noop = () => {};

/**
 * @function reduce
 *
 * @description
 * reduce the array to a single value
 *
 * @param {Array<any>} array the array to reduce
 * @param {function} fn the function called with each iteration
 * @param {any} initialValue the initial value of the reduction
 * @returns {any} the reduced value
 */
export const reduce = (array, fn, initialValue) => {
  let value = initialValue;

  for (let index = 0; index < array.length; index++) {
    value = fn(value, array[index], index, array);
  }

  return value;
};

/**
 * @function assign
 *
 * @description
 * shallowly merge the sources into the target object
 *
 * @param {Object} target the target object to merge into
 * @param  {...Object} sources the source objects to merge into target
 * @returns {Object} the merged object
 */
export const assign = (target, ...sources) =>
  reduce(
    sources,
    (assigned, source) =>
      typeof source === 'object'
        ? reduce(
          keys(source),
          (assignedSource, key) => {
            assignedSource[key] = source[key];

            return assignedSource;
          },
          assigned
        )
        : assigned,
    target
  );

/**
 * @function getActionCreators
 *
 * @description
 * get the actionCreators wrapped with the dispatch method
 *
 * @param {function|Object} actionCreators the actionCreators to wrap
 * @param {function} dispatch the instance-specific dispatch function
 * @returns {Object} the wrapped actionCreators
 */
export const getActionCreators = (actionCreators, dispatch, ownProps) => {
  const actionCreatorsTypeof = typeof actionCreators;

  return actionCreatorsTypeof === 'function'
    ? actionCreators(dispatch, ownProps)
    : actionCreators && actionCreatorsTypeof === 'object'
      ? reduce(
        keys(actionCreators),
        (wrappedActionCreators, name) => {
          wrappedActionCreators[name] = (...args) => dispatch(actionCreators[name](...args));

          return wrappedActionCreators;
        },
        {}
      )
      : {dispatch};
};

/**
 * @function getFunctionNameRegexp
 *
 * @description
 * using regexp derivation of the function's toString value, get the function name
 *
 * @param {function} fn the function to derive the name from
 * @returns {string} the function name
 */
export const getFunctionNameRegexp = (fn) => (/\W*function\s+([\w\$]+)\(/.exec(`${fn}`) || [])[1];

/**
 * @function getDisplayName
 *
 * @description
 * get the displayName of the component, either directly or derived
 *
 * @param {ReactComponent} Component the component to get the displayName for
 * @returns {string} the displayName
 */
export const getDisplayName = (Component) =>
  Component.displayName || Component.name || getFunctionNameRegexp(Component) || 'Component';

/**
 * @function getMergedProps
 *
 * @description
 * get the state, actionCreators, and props merged into a single props object to pass
 *
 * @param {Object} stateProps the state of the reducer
 * @param {Object} dispatchProps the wrapped action creators
 * @param {Object} ownProps the props passed directly to the component
 * @returns {Object} the merged props
 */
export const getMergedProps = (stateProps, dispatchProps, ownProps) => assign({}, ownProps, stateProps, dispatchProps);
