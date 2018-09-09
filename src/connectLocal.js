// external dependencies
import {shallowEqual} from 'fast-equals';
import {
  Component,
  createElement,
} from 'react';

// constants
import {DEFAULT_OPTIONS} from './constants';

// utils
import {
  assign,
  composeMiddleware,
  getDisplayName,
  reduce,
} from './utils';

/**
 * @function createDispatch
 *
 * @description
 * create the dispatch method for the component
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} reducer the reducer method
 * @returns {function(Object): void} the dispatch method for the component
 */
export const createDispatch = (instance, reducer) => {
  const dispatch = (action) => {
    instance.__state = reducer(instance.__state, action);
    instance.setState(() => instance.__state);

    return action;
  };
  const middlewareApi = {
    dispatch,
    getState: instance.getState,
  };

  return composeMiddleware(instance.options.middlewares.map((middleware) => middleware(middlewareApi)))(dispatch);
};

export const createGetState = (instance) =>
  /**
   * @function getState
   *
   * @description
   * get the current state of the component
   *
   * @returns {Object} the current state
   */
  () => instance.__state;

export const createShouldComponentUpdate = (instance) =>
  /**
   * @function shouldComponentUpdate
   *
   * @description
   * determine whether the component should update based on the options provided
   *
   * @param {Object} nextProps the next props of the component
   * @param {Object} nextState the next reducer values
   * @param {Object} nextContext the next context of the component
   * @returns {boolean} should the component update
   */
  (nextProps, nextState, nextContext) => {
    const {
      actionCreators,
      context,
      options: {areMergedPropsEqual, areOwnPropsEqual, areStatesEqual, mergeProps, pure},
      props,
      state,
    } = instance;

    if (!pure) {
      return true;
    }

    return (
      !areOwnPropsEqual(props, nextProps)
      || !areStatesEqual(state, nextState)
      || !shallowEqual(context, nextContext)
      || !areMergedPropsEqual(
        // eslint workaround
        mergeProps(state, actionCreators, props),
        mergeProps(nextState, actionCreators, nextProps)
      )
    );
  };

/**
 * @function getActionCreators
 *
 * @description
 * get the actionCreators wrapped with the dispatch method
 *
 * @param {Object} actionCreators the actionCreators to wrap
 * @param {function} dispatch the instance-specific dispatch function
 * @returns {Object} the wrapped actionCreators
 */
export const getActionCreators = (actionCreators, dispatch) =>
  reduce(
    Object.keys(actionCreators),
    (wrappedActionCreators, name) => {
      wrappedActionCreators[name] = (...args) => dispatch(actionCreators[name](...args));

      return wrappedActionCreators;
    },
    {}
  );

/**
 * @function onConstruct
 *
 * @description
 * on construction of the instance, set the options and the instance-specific methods
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} reducer the reducer with state
 * @param {Object} actionCreators the actionCreators to wrap with dispatch
 * @param {Object} options additional options for the component
 */
export const onConstruct = (instance, reducer, actionCreators, options) => {
  // state
  instance.state = reducer(undefined, {});
  instance.__state = instance.state;

  // options
  instance.options = assign({}, DEFAULT_OPTIONS, options);

  // lifecycle methods
  instance.shouldComponentUpdate = createShouldComponentUpdate(instance);

  // instance methods
  instance.getState = createGetState(instance);
  instance.dispatch = createDispatch(instance, reducer);

  // instance values
  instance.actionCreators = actionCreators ? getActionCreators(actionCreators, instance.dispatch) : {};
};

/**
 * @function connectLocal
 *
 * @description
 * decorate a component with a higher-order component that manages local state
 * in the way that redux manages global state
 *
 * @param {function} reducer the reducer with state
 * @param {Object} actionCreators the actionCreators to wrap with dispatch
 * @param {Object} options additional options for the component
 * @returns {function}
 */
export const connectLocal = (reducer, actionCreators, options) =>
  /**
   * @function ConnectedLocalComponent
   *
   * @description
   * higher-order component decorator which adds a redux-like manager for local state
   *
   * @param {ReactComponent} ComponentToConnect the component being wrapped
   * @returns {ReactComponent} the higher-order component
   */
  (ComponentToConnect) =>
    class ConnectedLocalComponent extends Component {
      static displayName = `ConnectedLocal(${getDisplayName(ComponentToConnect)})`;

      // state
      state = reducer(undefined, {});

      // lifecycle methods
      constructor(props) {
        super(props);

        onConstruct(this, reducer, actionCreators, options);
      }

      render() {
        return createElement(ComponentToConnect, this.options.mergeProps(this.state, this.actionCreators, this.props));
      }
    };
