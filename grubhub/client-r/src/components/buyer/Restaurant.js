import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { MdAccountBalance, MdRestaurant, MdImage} from "react-icons/md";

import {IoIosArrowDropleftCircle } from "react-icons/io";

import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import Menu from './Menu';
import PropTypes from 'prop-types';

class Restaurant extends Component {
    state = {

        restaurants: this.props.restaurants,
        selectedRestaurant: null

    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    };


    getSingleRestaurantView = (restaurant) => {
        return (<Col key={restaurant.id} className="app flex-row align-items-center">
            <Container style={{ marginTop: 10 + 'px' }}>

                        <Card className="text-left">
                            <CardHeader className="p-0">
                            {restaurant.data && restaurant.data.img ?
                                    (<CardImg src={restaurant.data.img} height={188 + "px"} width={50 + "px"}></CardImg>) : (<Container>
                                        <div style={{marginBottom:100+'px', marginRight:100+'px'}}></div>
                                        <MdRestaurant className/>
                                        <div style={{marginBottom:68+'px'}}></div>
                                        </Container>)}
                            </CardHeader>
                            <CardBody >
                                

                                        <h4>{restaurant.name ? restaurant.name : ''}</h4>
                                <p className="text-muted"> {((['A', 'E', 'I', 'O', 'U'].includes(restaurant.cuisine.slice(0, 1))) ? 'An ' : 'A ')
                                    + restaurant.cuisine.slice(0, 1).toUpperCase()
                                    + restaurant.cuisine.slice(1).toLowerCase()} restaurant located in {restaurant.zip}</p>
                            </CardBody>
                            <CardFooter>
                                <Button color="success" onClick={(e) => {

                                    this.setState({
                                        selectedRestaurant: restaurant
                                    })
                                }} className="btn btn-primary btn-lg btn-block" aria-label={"Go To " + restaurant.name}>{"Go To " + restaurant.name}</Button>
                            </CardFooter>
                        </Card>
            </Container>
        </Col>);
    }

    getRestaurantView = () => {
        let restaurantGroups = this.state.restaurants.map(restaurant => restaurant.cuisine);
        var resCards = Array.from(new Set(restaurantGroups)).map((cat) => (
            <Container key={cat} style={{ marginTop: 20 + 'px' }}>
                <Row className="justify-content-left">
                    <h3><strong>{cat}</strong></h3>
                </Row>
                <Row>
                    <Row className="justify-content-center">
                        {this.state.restaurants.filter(res => res.cuisine == cat)
                            .map((res) => {

                                return this.getSingleRestaurantView(res);

                            })}
                    </Row>
                </Row>
            </Container>

        ))

        return (<Container style={{ marginTop: 20 + 'px' }}>
            {resCards}
        </Container>)
    }

    getRestaurantDetailsView = () => {
        let background = this.state.selectedRestaurant.data 
                && this.state.selectedRestaurant.data.img?this.state.selectedRestaurant.data.img:'../../../resources/images/default.jpg'
        return (<div className="app flex-row align-items-center">
            <Container style={{ marginTop: 0 + 'px' }}>
                <Row className="justify-content-left p-0 " >
                    <Container style={{background: `url(${background})`, backgroundPosition:'center',left:0,right:0}}>
                    <div style={{marginBottom:20+'px'}}></div>
                    <Button color="link" onClick={(e) => {

                        this.setState({
                            selectedRestaurant: null
                        })
                    }}><IoIosArrowDropleftCircle color="primary" size='20%'/></Button>
                    <div style={{marginBottom:100+'px'}}></div>
                    </Container>
                </Row>
                <Row>
                    <Container className='p-4' >
                <Row className="justify-content-left">
                    
                <h1><strong>{this.state.selectedRestaurant.name ? this.state.selectedRestaurant.name : ''}</strong></h1>
                </Row>
                <Row className="justify-content-left">
                <p className="text-muted">An {this.state.selectedRestaurant.cuisine.toLowerCase()} restaurant located in {this.state.selectedRestaurant.zip}</p>
                </Row>
                </Container>
                </Row>
                <Row className="justify-content-center">
                    <Menu
                        restaurant={this.state.selectedRestaurant}
                        userId={this.props.auth.user.id}
                    />
                </Row>
            </Container>
        </div>);
    }


    render(){

        if(this.state.restaurants){
            if(this.state.selectedRestaurant){
                return (<Container>
                    {this.getRestaurantDetailsView()}
                    </Container>);
            }else{
                return (<Container>
                    {this.getRestaurantView()}
                    </Container>);
            }
        }
        return (<Container>
            <h2>No Restaurants in your area</h2>
            </Container>)
    }



}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}


export default connect(
    mapStateToProps,
    null
)(Restaurant);