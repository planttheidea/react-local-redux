// external dependencies
import {shallowEqual} from 'fast-equals';
import {
  Component,
  createElement,
} from 'react';
import {
  applyMiddleware,
  createStore,
} from 'redux';

// constants
import {DEFAULT_OPTIONS} from './constants';

// utils
import {
  assign,
  getActionCreators,
  getDisplayName,
  identity,
} from './utils';

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

export const createShouldComponentUpdate = (instance, actionCreators) =>
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
      __store,
      actionCreators: wrappedActionCreators,
      context,
      options: {areMergedPropsEqual, areOwnPropsEqual, areStatesEqual, mergeProps, pure},
      props,
      state,
    } = instance;

    if (typeof actionCreators === 'function' && (!pure || !areOwnPropsEqual(props, nextProps))) {
      instance.actionCreators = getActionCreators(actionCreators, __store.dispatch, nextProps);
    }

    if (!pure) {
      return true;
    }

    return (
      !areOwnPropsEqual(props, nextProps)
      || !areStatesEqual(state, nextState)
      || !shallowEqual(context, nextContext)
      || !areMergedPropsEqual(
        // eslint workaround
        mergeProps(state, wrappedActionCreators, props),
        mergeProps(nextState, instance.actionCreators, nextProps)
      )
    );
  };

export const createComponentWillUnmount = (instance) =>
  /**
   * @function componentWillMount
   *
   * @description
   * on unmount, unsubscribe from the store and remove it
   */
  () => {
    instance.__unsubscribe();
    instance.__store = null;
  };

/**
 * @function onConstruct
 *
 * @description
 * on construction of the instance, set the options and the instance-specific methods
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} reducer the reducer with state
 * @param {Object} actionCreators the actionCreators to wrap with dispatch
 * @param {function} [enhancer=identity] the method to create the store enhancer
 * @param {Array<function>} [middlewares=[]] the list of middlewares to apply
 * @param {Object} options additional options for the component
 */
export const onConstruct = (
  instance,
  reducer,
  actionCreators,
  {enhancer = identity, middlewares = [], ...options} = {}
) => {
  // options
  instance.options = assign({}, DEFAULT_OPTIONS, options);

  // store
  instance.__store = createStore(reducer, enhancer(applyMiddleware(...middlewares)));
  instance.__unsubscribe = instance.__store.subscribe(() => instance.setState(() => instance.__store.getState()));

  // lifecycle methods
  instance.shouldComponentUpdate = createShouldComponentUpdate(instance, actionCreators);
  instance.componentWillUnmount = createComponentWillUnmount(instance);

  // instance methods
  instance.getState = createGetState(instance);

  // instance values
  instance.actionCreators = getActionCreators(actionCreators, instance.__store.dispatch, instance.props);
  instance.state = instance.__store.getState();
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
  (ComponentToConnect) => {
    function ConnectedLocalComponent(initialProps) {
      Component.call(this, initialProps);

      onConstruct(this, reducer, actionCreators, options);

      this.render = function() {
        return createElement(ComponentToConnect, this.options.mergeProps(this.state, this.actionCreators, this.props));
      };

      return this;
    }

    ConnectedLocalComponent.prototype = Object.create(Component.prototype);

    ConnectedLocalComponent.displayName = `ConnectedLocal(${getDisplayName(ComponentToConnect)})`;

    return ConnectedLocalComponent;
  };
