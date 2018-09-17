// polyfill
import '@babel/polyfill';

// external dependencies
import React, {Component} from 'react';

// components
import Counter from './Counter';
import Number from './Number';

class App extends Component {
  state = {
    isMounted: false,
  };

  getRef = (instance) => console.log(instance) || console.log(instance.getWrappedInstance());

  toggleMounted = () => this.setState(({isMounted}) => ({isMounted: !isMounted}));

  render() {
    const {isMounted} = this.state;

    const number = ~~(Math.random() * 100);

    console.log(number);

    return (
      <div>
        <h1>App</h1>

        <div style={{marginBottom: 15}}>
          <button onClick={this.toggleMounted}>Toggle mounted</button>
        </div>

        <Counter ref={this.getRef} />
        <Counter />
        <Counter />

        {isMounted && <Counter />}

        <Number multiplier={number} />
      </div>
    );
  }
}

export default App;
