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
import { MdAccountCircle } from "react-icons/md";
import { IoMdRestaurant} from "react-icons/io";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';



class AppNavbar extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };




  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Fragment>
        <NavItem>
          <MdAccountCircle size ={25 + "px"} color='white'/>
          <span className='navbar-text mr-3 p-2'>
            <p className="font-weight-bold text-monospace">{this.props.auth.user && this.props.auth.user.name ? `${this.props.auth.user.name}` : ''}</p>
          </span>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem style={{padding:5+'px'}}>
        <Link to="/login">
          <Button type="button" className="btn btn-outline-danger"><strong>Sign in</strong></Button>
                            </Link>
        </NavItem>
      </Fragment>
    );

    return (
      <div>
        <Navbar color='danger' dark expand='sm' className='mb-5' style={{
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  "zIndex": 9099,
  "maxHeight": "72px"
}} >
          <Container>
            <NavbarBrand href='/'><IoMdRestaurant size ={25 + "px"} color='white'/>  GRUBHUB</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
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
)(AppNavbar);
