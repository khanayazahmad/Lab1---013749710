import React, { Component, Fragment } from 'react';
import axios from 'axios';

import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import { MdAccountBalance, MdRestaurant } from "react-icons/md";
import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, Badge } from 'reactstrap';
import Counter from './Counter';
class Menu extends Component {
    state = {
        menu: null,
        itemsCounter:{},
        offset:[],
        limit:3,
        count:[],
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value ? e.target.value : this.state[e.target.name] });
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



    addItem = (item) => {

        let quantity = this.state.itemsCounter[''+item.id]?this.state.itemsCounter[''+item.id]:1;

        console.log(quantity);

        axios
            .post('/cart/addItem', {
                item: item,
                quantity: quantity,
                userId:this.props.userId,
                restaurantId: this.props.restaurant.id,
                data:{
                    restaurant:this.props.restaurant.name
                }
            }, this.tokenConfig())
            .then(res => {
                console.log(res.data);
                if (res.data.cart == "SUCCESS") {

                    alert("Item succesfully added to cart!");
                }else{
                alert("Something went wrong. Please try again later!");
                }

            })
            .catch(err => {
                console.log(err);
            });

    }

    getSingleItemView = (id, name, price, image) => {
        return (<Col key={id} className="col-3">
            <Card className="mx-4" >
                <CardHeader>
                    <Row>
                        <Col className="col-8">
                            <h4>{name}</h4>
                        </Col>
                        <Col className="text-right">
                            <h4><Badge color="dark">${"  " + price}</Badge></h4>
                        </Col>
                    </Row>
                </CardHeader>
                

                    {image ? (<CardImg src={image} height={188 +"px"} ></CardImg>) : (<MdRestaurant />)}
                
                <CardFooter>
                    <Row>
                        <Col >
                            <Counter updateCounter = {(value)=>{
                                this.setState({
                                    itemsCounter: {...this.state.itemsCounter, [''+id]:value}
                                })
                            }}/>
                        </Col>
                        <Col className="text-right">
                            <Button onClick={this.addItem.bind(this, {id, name, price})} color="success" className="px-1" block disabled={this.state.itemsCounter[''+id]==0}>Add to Cart</Button>
                        </Col>
                    </Row>
                </CardFooter>
            </Card></Col>);
    }

    getPrev = (cat) => {
        axios
            .get(`/menu/${this.state.menu.id}/getByCat/${cat}?limit=3&offset=${(this.state.offset[cat] - this.state.limit)>=0?(this.state.offset[cat] - this.state.limit):0}`, this.tokenConfig())
            .then(res => {
                if (res.data.items) {
                    var offset = this.state.offset;
                    offset[cat] = (this.state.offset[cat] - this.state.limit)>=0?(this.state.offset[cat] - this.state.limit):0;
                    var menu = this.state.menu
                    menu.items = this.state.menu.items.filter(item => item.category != cat);
                    menu.items = menu.items.concat(res.data.items);
                    this.setState({
                        menu: menu,
                        offset:offset
                    })
                }

            })
            .catch(err => {
                console.log(err);
            });
    }

    getNext = (cat) => {
        console.log(this.state.menu)
        axios
            .get(`/menu/${this.state.menu.id}/getByCat/${cat}?limit=3&offset=${this.state.offset[cat]+ this.state.limit}`, this.tokenConfig())
            .then(res => {
                if (res.data.items) {
                    var offset = this.state.offset;
                    offset[cat] = (this.state.offset[cat] + this.state.limit);
                    var menu = this.state.menu
                    menu.items = this.state.menu.items.filter(item => item.category != cat);
                    menu.items = menu.items.concat(res.data.items);
                    this.setState({
                        menu: menu,
                        offset:offset
                    })
                }

            })
            .catch(err => {
                console.log(err);
            });
    }

    getItemView = () => {

        var catSet = this.state.menu.items.map(item => item.category);
        catSet = catSet.sort();
        var itemCards = Array.from(new Set(catSet)).map((cat) => (
            <Container key={cat} style={{ marginTop: 20 + 'px',"width":"100%","maxWidth":"none"}}>
                <Row className="justify-content-left align-items-left">
                    <h1>{cat}</h1>
                </Row>
                <Row>
                <Col className="col-1">
                            <Button color="link" disabled={this.state.offset[cat] == 0} onClick={this.getPrev.bind(this, cat)}><IoIosArrowDropleftCircle color="primary" size='100%' /></Button>
                        </Col>
                    
                        {this.state.menu.items.filter(item => item.category == cat)
                            .map(({ id, name, price, image }) => {
                                
                                    return this.getSingleItemView(id, name, price, image);
                                
                            })}
                    <Col className="col-1">
                            <Button color="link" onClick={this.getNext.bind(this, cat)}>
                                <IoIosArrowDroprightCircle color="primary" size='100%' /></Button>
                        </Col>
                </Row>
            </Container>

        ))

        return (
            <Container style={{ marginTop: 20 + 'px',"width":"90%","maxWidth":"none" }}>
                {itemCards}
            </Container>
        );
    }

    componentDidMount = () => {
        if (this.props.restaurant) {
            axios
                .get('/menu/getByRestaurant/' + this.props.restaurant.id, this.tokenConfig())
                .then(res => {
                    if (res.data.menu) {
                        var os = {};
                       res.data.menu.items.forEach(item=>{
                            os[item.category] = 0;
                        })
                        this.setState({
                            menu: res.data.menu,
                            offset: os
                        })
                    }

                })
                .catch(err => {
                    console.log(err);
                });
        }

    }


    render() {

        return (<div className="app flex-row align-items-center">
            <div style={{ marginTop: 100 + 'px' }}>
                {this.state.menu ? this.getItemView() : JSON.stringify(this.props)}
            </div>
        </div>);



    }


}

export default Menu;