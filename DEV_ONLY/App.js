// polyfill
import '@babel/polyfill';

// external dependencies
import React, {Component} from 'react';

// components
import Counter from './Counter';

class App extends Component {
  state = {
    isMounted: false,
  };

  toggleMounted = () => this.setState(({isMounted}) => ({isMounted: !isMounted}));

  render() {
    const {isMounted} = this.state;

    return (
      <div>
        <h1>App</h1>

        <div style={{marginBottom: 15}}>
          <button onClick={this.toggleMounted}>Toggle mounted</button>
        </div>

        <Counter />
        <Counter />
        <Counter />

        {isMounted && <Counter />}
      </div>
    );
  }
}

export default App;
