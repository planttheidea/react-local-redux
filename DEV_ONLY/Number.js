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

const INITIAL_STATE = {number: Math.random() * 100};

const actionCreators = (dispatch, ownProps) => {
  console.log(dispatch, ownProps);
  console.log({
    number: Math.random() * ownProps.multiplier,
    type: 'SET_NUMBER',
  });

  return {
    setNumber: () =>
      dispatch({
        payload: Math.random() * ownProps.multiplier,
        type: 'SET_NUMBER',
      }),
  };
};

const reducer = (state = INITIAL_STATE, action) => (action.type === 'SET_NUMBER' ? {number: action.payload} : state);

const options = {
  // eslint-disable-next-line rapid7/no-trailing-underscore
  enhancer: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: `Number`,
  }),
};

class Number extends Component {
  static propTypes = {
    multiplier: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    setNumber: PropTypes.func.isRequired,
  };

  render() {
    const {number, setNumber} = this.props;

    console.log(this.props);

    return (
      <div style={{marginTop: 15}}>
        <div style={{marginBottom: 15}}>Number: {number}</div>

        <button onClick={setNumber}>Change number</button>
      </div>
    );
  }
}

export default connectLocal(reducer, actionCreators, options)(Number);
