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
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import Cart from './Cart';
import Order from './Order';
import Profile from './Profile'

class Dashboard extends Component {
  state = {
        restaurants: null,
        view: 'Restaurant',
        offset:0,
        limit:3
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
        config.headers['Authorization'] = token;
    }

    return config;
};

switch= () => {
  if(this.state.view == 'Restaurant'){
    return (this.state.restaurants?(<Restaurant 
    restaurants={this.state.restaurants}
    setFilteredRestaurants = {this.setFilteredRestaurants}
    getAllRestaurants ={this.getAllRestaurants}
    getPagination = {this.getPagination}/>):<div>No restaurants available</div>);
  }else if(this.state.view == 'Cart'){
    return (<Cart />);
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
          view:'Cart'
        })
      }}>Cart</Button>
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
                restaurants: res.data.restaurants,
                offset:0,
                limit:3
            })
        } 

    })
    .catch(err => {
        console.log(err);
    });



  };

  getPrev = () => {
    axios
        .get(`restaurant/getAll?limit=3&offset=${(this.state.offset - this.state.limit)>=0?(this.state.offset - this.state.limit):0}`, this.tokenConfig())
        .then(res => {
            if (res.data.restaurants) {
                var offset = (this.state.offset - this.state.limit)>=0?(this.state.offset - this.state.limit):0;
                this.setState({
                    restaurants: res.data.restaurants,
                    offset:offset
                })
            }

        })
        .catch(err => {
            console.log(err);
        });
}

getNext = () => {
    axios
        .get(`/restaurant/getAll?limit=3&offset=${this.state.offset+ this.state.limit}`, this.tokenConfig())
        .then(res => {
            if (res.data.restaurants) {
                var offset = (this.state.offset + this.state.limit)
                this.setState({
                    restaurants: res.data.restaurants,
                    offset:offset
                })
            }

        })
        .catch(err => {
            console.log(err);
        });
}


  getPagination = () => {
    return (
      <Row className="justify-content-center align-items-center" style={{ marginLeft: 10 + 'px' }}>
        <Col className="col-1">
          <Button color="link" disabled={this.state.offset == 0} onClick={this.getPrev.bind(this)}><IoIosArrowDropleftCircle color="primary" size='100%' /></Button>
        </Col>
        <Col className="col-10"></Col>
        <Col className="col-1">
          <Button color="link" onClick={this.getNext.bind(this)}>
            <IoIosArrowDroprightCircle color="primary" size='100%' /></Button>
        </Col>
      </Row>
    );
  }

  setFilteredRestaurants = (restaurants) => {

    this.setState({
      restaurants: restaurants
    });

  };

  componentDidMount(){
      if(this.state.restaurants == null){
          this.getAllRestaurants();
      }
  }


  render() {

    return (
      <div>
        {this.getSideBar()}
              <div style={{"paddingTop":"40px", "paddingLeft":"10%","width":"90%","maxWidth":"none"}}>
                {this.switch()}
              </div>
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
