import React, { Component, Fragment } from 'react';
import { NavLink, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

export class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.props.logout} href='#' className="btn btn-outline-danger">
          Logout
        </Button>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { logout }
)(Logout);
