import React, { Component } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import Login from './components/auth/LoginModal';
import Register from './components/auth/RegisterModal';
import Home from './components/Home';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
//Create a Main Component
class Router extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            {/*Render Different Component based on Route*/}
            <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
            <Route exact path="/" render={props => <Home {...props} />} />
            <Route path="/register" render={props => <Register {...props} role = 'BUYER'/>} />
            <Route path="/register_owner" render={props => <Register {...props} role = 'OWNER'/>} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}
//Export The Main Component
export default Router;