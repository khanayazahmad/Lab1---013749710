import React, { Component, Fragment } from 'react';

import { Button, Card, CardBody, CardFooter, Col, Container, Badge, Table, Row, CardHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';
import AppNavbar from './AppNavbar';
import OwnerDashboard from './owner/Dashboard';
import UserDashboard from './buyer/Dashboard';
import banner from "../resources/images/default.jpg";

class Home extends Component {
  state = {

  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };


  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authOwnerLinks = (
      <React.Fragment>
          <OwnerDashboard />
      </React.Fragment>
    );

    const authUserLinks = (
      <React.Fragment>
          <UserDashboard/>
      </React.Fragment>
    );

    const guestLinks = (
      <Row>
        <Col className="left-cont">
        <Container style={{background:`url('https://media-cdn.grubhub.com/image/upload/c_scale,w_1650/q_50,dpr_auto,f_auto,fl_lossy,c_crop,e_vibrance:20,g_center,h_900,w_800/v1534256595/Onboarding/Burger.jpg')`, backgroundSize: 'cover'}}>         
        </Container>
        </Col>
        <Col>
        <Container className="textct" style={{fontSize:'3rem'}}> 
        Order food delivery<br/> you’ll love  
        </Container>
        </Col>
        </Row>
    );

    return (
      <React.Fragment>
              <AppNavbar />
              <React.Fragment style={{"marginLeft":"10%","width":"90%","maxWidth":"none"}}>
              {isAuthenticated? user.role == 'OWNER'? authOwnerLinks: authUserLinks : guestLinks}
              </React.Fragment>
      </React.Fragment>
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
