import React, { Component, Fragment } from 'react';
import axios from 'axios';
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
  Container,
  Row,
  Col,
  ListGroupItem,
  ListGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Restaurant from './Restaurant';
import { tokenConfig } from '../../actions/authActions';
import Order from './Order';
import Profile from './Profile'

class Dashboard extends Component {
  state = {
        restaurants: null,
        view: 'Restaurant'
  };



  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  tokenConfig = () => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};

switch= () => {
  if(this.state.view == 'Restaurant'){
    return this.state.restaurants?(<Restaurant restaurants={this.state.restaurants}/>):(<Container>
      <h2>No Restaurants in your area</h2>
      </Container>);
  }
  else if(this.state.view == 'Orders'){
    return (<Order />);
  }
  else if(this.state.view == 'Profile'){
    return (<Profile />);
  }
}

getSideBar = () => {

  let sidebar = {
    zIndex: '1000',
  position: 'fixed',
  left: '250px',
  width: '250px',
  height: '100%',
  marginLeft: '-250px',
  paddingTop: '50px',
  overflowY: 'auto',
  background: '#37474F',
  webkitTransition: 'all 0.5s ease',
  mozTransition: 'all 0.5s ease',
  oTransition: 'all 0.5s ease',
  transition: 'all 0.5s ease',
  };
  return (
    <Nav className="col-md-2 d-none d-md-block bg-dark sidebar" style={sidebar}>
    <Container>

              <Nav className='ml-auto' navbar>
              
    <Row className="p-6">
      <Col className="col-12">
    <NavItem>
      <Button color="secondary" outline size="lg" block onClick={()=>{
        this.setState({
          view:'Restaurant'
        })
      }}>Restaurants</Button>
    </NavItem>
    </Col>
    </Row>
    <Row className="p-6">
    <Col className="col-12">
    <NavItem>
      <Button color="secondary" outline size="lg" block onClick={()=>{
        this.setState({
          view:'Profile'
        })
      }}>Profile</Button>
    </NavItem>
    </Col>
    </Row>
    <Row className="p-6">
    <Col className="col-12">
    <NavItem>
      <Button color="secondary" outline size="lg" block onClick={()=>{
        this.setState({
          view:'Orders'
        })
      }}>Orders</Button>
    </NavItem>
    </Col>
    </Row>


              </Nav>
          </Container>
    </Nav>
  )
}

  getAllRestaurants = () => {

    axios.get('restaurant/getAll', this.tokenConfig()).then(res => {
        if (res.data.restaurants) {
            this.setState({
                restaurants: res.data.restaurants
            })
        } 

    })
    .catch(err => {
        console.log(err);
    });



  };

  componentDidMount(){
      if(this.state.restaurants == null){
          this.getAllRestaurants();
      }
  }


  render() {

        let restaurant = this.state.restaurants?(<Restaurant restaurants={this.state.restaurants}/>):(<Container>
            <h2>No Restaurants in your area</h2>
            </Container>)
    return (
      <div>
        {this.getSideBar()}
              <Container style={{"paddingTop":"30px", "paddingLeft":"10%"}}>
                {this.switch()}
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
)(Dashboard);
