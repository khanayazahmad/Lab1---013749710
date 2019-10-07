import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { MdAccountBalance, MdRestaurant } from "react-icons/md";
import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, Badge } from 'reactstrap';
import AddItem from './AddItem';
import EditItem from './EditItem';
class Menu extends Component {
    state = {
        edit: [],
        add: false,
        menu: null
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



    deleteItem = (id) => {
        axios
            .delete('/menu/deleteItem/' + id, this.tokenConfig())
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

    updateItem = (body) => {
        let updatedEdit = this.state.edit.filter(id => id != body.where.id);
        console.log(updatedEdit);
        axios
            .post('/menu/updateItem', body, this.tokenConfig())
            .then(res => {
                if (res.data.menu) {
                    this.setState({
                        menu: res.data.menu,
                        edit: updatedEdit?updatedEdit:[]
                    })
                } else {
                    this.setState({
                        edit: this.edit
                    });
                }

            })
            .catch(err => {
                console.log(err);
            });
    }

    addItem = (newItem) => {

        axios
            .post('/menu/addItem', {
                menuId: this.state.menu.id,

                name: newItem.name,
                category: newItem.category,
                price: newItem.price,
                menuId: newItem.menuId,
                image: newItem.img
            }, this.tokenConfig())
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
                <CardBody className='p-0'>

                    {image ? (<CardImg src={image} height={188 +"px"}></CardImg>) : (<MdRestaurant />)}
                </CardBody>
                <CardFooter>
                    <Row>
                        <Col xs="6">
                            <Button color="primary" className="px-1" onClick={(e) => {

                                this.setState({
                                    edit: this.state.edit? this.state.edit.concat([id]):[id]
                                })
                            }} block>Edit</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                            <Button onClick={this.deleteItem.bind(this, id)} color="danger" className="px-1" block>Delete</Button>
                        </Col>
                    </Row>
                </CardFooter>
            </Card></Col>);
    }


    getItemView = () => {

        var catSet = ["APPETIZER", "BREAKFAST", "LUNCH"];
        this.state.menu.items.forEach(item => catSet.push(item.category));
        var itemCards = Array.from(new Set(catSet)).map((cat) => (
            <Container key={cat} style={{ marginTop: 20 + 'px' }}>
                <Row className="justify-content-center">
                    <h1>{cat}</h1>
                </Row>
                <Row>
                    <Row className="justify-content-center align-items-center">
                        {this.state.menu.items.filter(item => item.category == cat)
                            .map(({ id, name, price, image }) => {
                                if(this.state.edit && this.state.edit.length > 0 && this.state.edit.filter(eid=>eid==id).length > 0){
                                    return (<EditItem 
                                    key = {id}
                                    id = {id}
                                    name = {name}
                                    price = {price}
                                    updateItem = {this.updateItem}
                                    menuId = {this.state.menu.id}
                                    category={cat}
                                    />);
                                }else {
                                    return this.getSingleItemView(id, name, price, image);
                                }
                            }).concat([
                                (
                                    <AddItem
                                        key={cat}
                                        menuId={this.state.menu.id}
                                        category={cat}
                                        addItem={this.addItem}
                                    />
                                )
                            ])}
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
                    } else {
                        axios.post('/menu/create/' + this.props.restaurant.id, {}, this.tokenConfig())
                            .then(res => {
                                if (res.data.menu) {
                                    this.setState({
                                        menu: res.data.menu
                                    })
                                }
                            }).catch(err => {
                                console.log(err);
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