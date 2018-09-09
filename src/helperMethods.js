// utils
import {
  identity,
  isUndefined,
  noop,
} from './utils';

/**
 * @function createAction
 *
 * @description
 * create an action creator based on the parameters passed
 *
 * @param {string} type the type of action being dispatched
 * @param {function} [payloadHandler=identity] the function to get the payload value
 * @param {function} [metaHandler=noop] the function to get the meta value
 * @returns {function(...any): Object} the actionCreator
 */
export const createActionCreator = (type, payloadHandler = identity, metaHandler = noop) => {
  if (typeof type !== 'string') {
    throw new ReferenceError('The action type passed must be a string.');
  }

  if (typeof payloadHandler !== 'function') {
    throw new ReferenceError('The payload handler passed must be a function.');
  }

  if (typeof metaHandler !== 'function') {
    throw new ReferenceError('The meta handler passed must be a function.');
  }

  const actionCreator = (...args) => {
    const action = {type};

    const payload = payloadHandler(...args);

    if (!isUndefined(payload)) {
      action.payload = payload;

      if (payload instanceof Error) {
        action.isError = true;
      }
    }

    const meta = metaHandler(...args);

    if (!isUndefined(meta)) {
      action.meta = meta;
    }

    return action;
  };

  actionCreator.toString = () => type;

  return actionCreator;
};

/**
 * @function createReducer
 *
 * @description
 * based on the handlers and initial state passed, build a reducer function
 *
 * @param {Object} handlers the handlers to build the reducer from
 * @param {Object} initialState the initial state of the reducer
 * @returns {function(Object, Object): Object} the reducer for the component
 */
export const createReducer = (handlers, initialState = {}) => {
  if (typeof handlers === 'function') {
    return handlers;
  }

  if (typeof handlers !== 'object') {
    throw new ReferenceError('The handlers passed must be an object.');
  }

  return (state = initialState, action) => {
    const handler = handlers[action.type];

    return handler ? handler(state, action) : state;
  };
};
