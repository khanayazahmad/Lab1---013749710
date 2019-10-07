import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { MdAccountBalance, MdRestaurant } from "react-icons/md";
import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, Badge } from 'reactstrap';
import Counter from './Counter';
class Menu extends Component {
    state = {
        menu: null,
        itemsCounter:{}
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
            config.headers['x-auth-token'] = token;
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
                restaurantId: this.props.restaurant.id

            }, this.tokenConfig())
            .then(res => {
                if (res.data.message == "SUCCESS") {
                    alert("Item succesfully added to cart!");
                }

            })
            .catch(err => {
                console.log(err);
            });

    }

    getSingleItemView = (id, name, price, image) => {
        return (<Col key={id} className="col-6">
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


    getItemView = () => {

        var catSet = this.state.menu.items.map(item => item.category);
        var itemCards = Array.from(new Set(catSet)).map((cat) => (
            <Container key={cat} style={{ marginTop: 20 + 'px' }}>
                <Row className="justify-content-center">
                    <h1>{cat}</h1>
                </Row>
                <Row>
                    <Row className="justify-content-center">
                        {this.state.menu.items.filter(item => item.category == cat)
                            .map(({ id, name, price, image }) => {
                                
                                    return this.getSingleItemView(id, name, price, image);
                                
                            })}
                    </Row>
                </Row>
            </Container>

        ))

        return (
            <Container style={{ marginTop: 20 + 'px' }}>
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
                        this.setState({
                            menu: res.data.menu
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
            <Container style={{ marginTop: 100 + 'px' }}>
                {this.state.menu ? this.getItemView() : JSON.stringify(this.props)}
            </Container>
        </div>);



    }


}

export default Menu;