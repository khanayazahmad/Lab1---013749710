import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';
import AppNavbar from './AppNavbar';
import OwnerDashboard from './owner/Dashboard';
import UserDashboard from './buyer/Dashboard';

class Home extends Component {
  state = {

  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };


  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authOwnerLinks = (
      <Container>
          <OwnerDashboard />
      </Container>
    );

    const authUserLinks = (
      <Container>
          <UserDashboard/>
      </Container>
    );

    const guestLinks = (
        <Container>
        </Container>
    );

    return (
      <div>
              <AppNavbar />
              <Container >
              {isAuthenticated? user.role == 'OWNER'? authOwnerLinks: authUserLinks : guestLinks}
              </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}
//   {
//   auth: state.auth,
//   name: state.auth.user
// });

export default connect(
  mapStateToProps,
  null
)(Home);
