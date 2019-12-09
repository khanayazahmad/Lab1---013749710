import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import {BrowserRouter} from 'react-router-dom';
import Router from './Router';
import axios from 'axios'; import {API_PATH} from './config'
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql'
});

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
       
    return (
      <ApolloProvider client={client}>
      <Provider store={store}>
        <div className='App' style={{"paddingTop": "52px"}}>
        <BrowserRouter>
        <div>
          <Router/>
        </div>
      </BrowserRouter>
        </div>
      </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
