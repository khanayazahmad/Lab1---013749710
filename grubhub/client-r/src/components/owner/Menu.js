import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { MdAccountBalance, MdRestaurant } from "react-icons/md";

import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, Badge } from 'reactstrap';
import AddItem from './AddItem';
import EditItem from './EditItem';
class Menu extends Component {
    state = {
        edit: [],
        add: false,
        menu: null,
        categories:[],
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
    
    deleteItem = (id) => {
        axios
            .get('/menu/deleteItem/' + id, this.tokenConfig())
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

        var catSet = this.state.menu.items.map(item => item.category).concat(this.state.categories);
        catSet = catSet.sort();
        var itemCards = Array.from(new Set(catSet)).map((cat) => (
            <Container className="container-fluid" key={cat} style={{ marginTop: 20 + 'px', "overflow-x": "auto", "display": "inline-block",
            "float": "none","maxWidth":"none"}}>
                <Row className="justify-content-center">
                    <h1>{cat}</h1>
                </Row>
                <Row>
                    <Col>
                    <Row className="justify-content-center align-items-center" style={{ marginLeft: 10 + 'px'}}>
                        <Col className="col-1">
                            <Button color="link" disabled={this.state.offset[cat] == 0} onClick={this.getPrev.bind(this, cat)}><IoIosArrowDropleftCircle color="primary" size='100%' /></Button>
                        </Col>
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
                            })}
                        <Col className="col-1">
                            <Button color="link" onClick={this.getNext.bind(this, cat)}>
                                <IoIosArrowDroprightCircle color="primary" size='100%' /></Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center p-3" style={{ marginLeft: 10 + 'px'}}>
                    <Col ></Col>
                        <Col >
                    <AddItem
                                        key={cat}
                                        menuId={this.state.menu.id}
                                        category={cat}
                                        addItem={this.addItem}
                                    />
                                    </Col>
                                    <Col ></Col>
                    </Row>
                    </Col>
                </Row>
            </Container>

        ))

        return (
            <Container style={{ marginTop: 20 + 'px', "maxWidth": "none" }}>
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

    createCatView = () => {

        return (<Container className='p-3'>

                <InputGroup className="mb-3">
                                        
                                        <Input
                                            type='text'
                                            name='searchText'
                                            id='searchText'
                                            placeholder="New Category ..."
                                            onChange={this.onChange}
                                            value={this.state.searchText}
                                        />
                                        <Button color="success" onClick={(e)=>{
                                            this.setState({
                                                categories: this.state.categories.concat([this.state.searchText.toUpperCase()])
                                            })
                                        }}> Add </Button>

                                    </InputGroup>

        </Container>)
    }


    render() {

        return (<div className="app flex-row align-items-center" style={{"width":"100%"}}>
            <Row>
                {this.createCatView()}
            </Row>
            <Row>
            <Container style={{ marginTop: 100 + 'px', "maxWidth":"none" }}>
                {this.state.menu ? this.getItemView() : JSON.stringify(this.props)}
            </Container>
            </Row>
        </div>);



    }


}

export default Menu;