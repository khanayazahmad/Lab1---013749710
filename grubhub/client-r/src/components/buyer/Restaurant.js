import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { MdAccountBalance, MdRestaurant, MdImage, MdSearch} from "react-icons/md";

import {IoIosArrowDropleftCircle } from "react-icons/io";

import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import Menu from './Menu';
import PropTypes from 'prop-types';

class Restaurant extends Component {
    state = {

        restaurants: this.props.restaurants,
        selectedRestaurant: null,
        searchText: null,
        searchFilter: 'NO FILTER'

    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onChangeFilter = e => {

        var restaurants = this.props.restaurants.filter(res=> !e.target.value || e.target.value == 'NO FILTER' || (res.cuisine == e.target.value));
        this.setState({ searchFilter: e.target.value,
            restaurants: restaurants });
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
            <div style={{"width":"100%","maxWidth":"none"}}>
                <Row className="justify-content-left p-0 " >
                    <div style={{background: `url(${background})`, backgroundPosition:'center',marginLeft:40+"px",right:0,"width":"100%","maxWidth":"none"}}>
                    <div style={{marginBottom:20+'px'}}></div>
                    <Button color="link" onClick={(e) => {

                        this.setState({
                            selectedRestaurant: null
                        })
                    }}><IoIosArrowDropleftCircle color="primary" size='20%'/></Button>
                    <div style={{marginBottom:100+'px'}}></div>
                    </div>
                </Row>
                <Row>
                    <Container className='p-4' style={{marginLeft:40+"px","width":"100%","maxWidth":"none"}}>
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
            </div>
        </div>);
    }

    search=()=>{

        const body={};
        if(this.state.searchText){
            body.name=this.state.searchText;
        }
        if(body.name){
        axios.post('/search',body, this.tokenConfig()).then(res=>{
            if(res.data.restaurants){

                var restaurants = res.data.restaurants.filter(res=> !this.state.searchFilter || this.state.searchFilter == 'NO FILTER' || (res.cuisine == this.state.searchFilter));

                this.setState({
                    restaurants: restaurants
                });
            }else{
                this.setState({
                    restaurants: []
                });
            }
            
        }).catch(err => {
            console.log(err);
        })
    }else{
        this.props.getAllRestaurants();
    }
    }

    getSearchView = () => {
        var cuisines = Array.from(new Set(this.props.restaurants.map(restaurant => restaurant.cuisine)));
        
        var filterOptions = cuisines.map(cuisine => <option value={cuisine}>{cuisine}</option>);
        filterOptions.push((<option value='NO FILTER'>No Filter</option>))
        return (<Container className='p-3'>
            <Row className='p-3'>
                <Col>
                <InputGroup className="mb-3">
                                        
                                        <Input
                                            type='text'
                                            name='searchText'
                                            id='searchText'
                                            placeholder="Search Restaurants ..."
                                            onChange={this.onChange}
                                            value={this.state.searchText}
                                        />
                                        <Button color="danger" onClick={this.search}> <MdSearch/></Button>

                                    </InputGroup>
                                    </Col>
                                    <Col>

                                    <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        Filter
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input type="select" name='searchFilter' id='searchFilter' onChange={this.onChangeFilter} value={this.state.searchFilter}>
                                    {filterOptions}
                                </Input>
                            </InputGroup>
                            </Col>
                            </Row>
        </Container>)
    }


    render(){
        if(this.state.restaurants){
            if(this.state.selectedRestaurant){
                return (<div style={{"width":"100%","maxWidth":"none"}}>
                    {this.getRestaurantDetailsView()}
                    </div>);
            }else{
                return (<Container style={{"marginLeft":"10%","width":"90%","maxWidth":"none"}}>
                    <Row>
                        {this.getSearchView()}
                    </Row>
                    <Row>
                    {this.getRestaurantView()}
                    </Row>
                    <Row>
                        <Col>
                    {this.props.getPagination()}
                    </Col>
                    </Row>
                    </Container>);
            }
        }
        return (<Container>
            <Row>
                        {this.getSearchView()}
                    </Row>
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