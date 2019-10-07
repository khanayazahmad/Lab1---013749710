import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import {BrowserRouter} from 'react-router-dom';
import Router from './Router';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <div className='App' style={{"paddingTop": "52px"}}>
        <BrowserRouter>
        <div>
          <Router/>
        </div>
      </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
