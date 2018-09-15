# react-local-redux

Manage component-specific state as you would global state via redux

## Table of contents

- [Summary](#summary)
- [Usage](#usage)
- [connectLocal](#connectlocal)
  - [Options](#options)
- [Additional imports](#additional-imports)
  - [createActionCreator](#createactioncreator)
  - [createReducer](#createreducer)

## Summary

The [`redux`](https://github.com/reduxjs/redux) library has changed the way that we manage state within our JavaScript applications, and is a wonderful tool. Like many great tools, though, developers see it as a hammer in a world of nails, using `redux` for all state regardless of whether it should be global or not. The creator of `redux` himself [has even written about how `redux` should be used selectively](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367), because `redux` is meant for global state.

`react-local-redux` tries to strike a balance, leveraging the powers of the `redux` paradigm but keeping state that does not need to be global scoped to the component that it should live in by creating a higher-order component that operates like a local store. It's usage should come naturally to those who have used [`react-redux`](https://github.com/reduxjs/react-redux), you can [use `redux` middlewares and enhancers](#options), and there are even helpers to remove boilerplate related to building [action creators](#createactioncreator) and [reducers](#createreducer).

## Usage

```javascript
import { connectLocal } from "react-local-redux";

const actionCreators = {
  decrement: () => ({ type: "DECREMENT" }),
  increment: () => ({ type: "INCREMENT" })
};

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1
      };

    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
};

@connectLocal(reducer, actionCreators)
class App extends Component {
  render() {
    return (
      <div>
        <div>Count: {this.props.count}</div>

        <button onClick={decrement}>Decrement</button>
        <button onClick={increment}>Increment</button>
      </div>
    );
  }
}
```

## connectLocal

`connectLocal(reducer: function[, actionCreators: Object[, options: Object]]) => (ComponentToWrap: ReactComponent): ReactComponent`

Decorator that accepts a `reducer` function and a map of functions as `actionCreators`, returning a function that accepts a `ReactComponent` and returns a higher-order `ReactComponent`. Internally the `reducer` will be used as local state, with each of the `actionCreators` being used to update that state. Both the local state and the wrapped `actionCreators` will be passed to the `ComponentToWrap` as props, very much align the lines of `connect` in the `react-redux` package. If no `actionCreators` are passed, the `dispatch` method itself will be passed as a prop to the `ComponentToWrap`.

#### options

Like `connect` in `react-redux`, you can pass an object of `options` to customize how `connectLocal` will operate:

- `pure: boolean`
  - is the component considered a "pure" component, meaning does it only update when props / state / context has changed based on strict equality
- `areOwnPropsEqual(currentProps: Object, nextProps: Object): boolean`
  - custom props equality comparator
- `areStatesEqual(currentState: Object, nextState: Object): boolean`
  - custom states equality comparator
- `areStatesEqual(mergedProps: Object, nextMergedProps: Object): boolean`
  - custom equality comparator for the merged state, actionCreators, and props passed to the component

Additionally, there are some options specific to `connectLocal` that provide more functionality:

- `enhancer(fn: function): function`
  - store enhancer used in `redux.createStore()`

```javascript
@connectLocal(reducer, actionCreators, {
  enhancer: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: 'MySpecialComponent'
  })
})
```

- `middlewares: Array<function>`
  - array of redux middlewares to be appled to the `dispatch` method

```javascript
@connectLocal(reducer, actionCreators, {middlewares: [reduxThunk]})
```

- `mergeProps(state: Object, actionCreators: Object, props: Object): Object`
  - custom method to merge state, actionCreators, and props into the props passed to the component

## Additional imports

Additional imports are available for handling construction of action creators and reducers. The paradigm will be familiar to those who have used the [`redux-actions`](https://github.com/redux-utilities/redux-actions) library.

#### createActionCreator

`createActionCreator(type: string[, payloadHandler: function = identity[, metaHandler: function = noop]]): function`

Create a Flux Standard Action in the same vein as `redux-actions`.

```javascript
const addStuff = createActionCreator("ADD_STUFF");

addStuff({ added: "stuff" });
// {payload: {added: 'stuff'}, type: 'ADD_STUFF'}
```

By default, the first parameter passed to the action creator will be used as the payload, but you can provide custom handlers for the payload and the meta if desired.

```javascript
const addStuff = createActionCreator(
  "ADD_STUFF",
  ({ added }) => added,
  ({ added }) => added === "stuff"
);

addStuff({ added: "stuff" });
// {meta: true, payload: 'stuff', type: 'ADD_STUFF'}
```

Additionally, if an error is provided as the payload, an `error` property will be automatically set to `true` on the action.

#### createReducer

`createReducer(handlers: Object, initialState: Object): function`

Create a reducer based on a map of handlers, each themselves a reducer.

```javascript
const handlers = {
  SET_THING; (state, {payload}) => ({
    ...state,
    thing: payload,
  }),
};

const initialState = {
  thing: null,
};

const reducer = createReducer(handlers, initialState);

const result = reducer(initialState, {payload: 'new thing', type: 'SET_THING'});
// {thing: 'new thing'}
```

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `build` => run webpack to build development `dist` file with NODE_ENV=development
- `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
- `dev` => run webpack dev server to run example app / playground
- `dist` => runs `build` and `build:minified`
- `lint` => run ESLint against all files in the `src` folder
- `prepublish` => runs `prepublish:compile` when publishing
- `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
- `transpile:lib` => run babel against all files in `src` to create files in `lib`
- `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
