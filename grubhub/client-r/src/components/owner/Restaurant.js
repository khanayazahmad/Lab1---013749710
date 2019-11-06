import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { MdAccountBalance, MdRestaurant, MdImage } from "react-icons/md";

import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from './Menu';

class Restaurant extends Component {
    state = {
        edit: false,
        add: false,
        restaurant: null,
        name: null,
        cuisine: null,
        zip: null,
        selectedFile: null,
        imgSrc: null
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    };


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

    singleFileChangedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    getRestaurantDetails = () => {
        axios
            .get('/restaurant/getByOwner/' + this.props.auth.user.id, this.tokenConfig())
            .then(res => {
                if (res.data.restaurant) {
                    this.setState({
                        restaurant: res.data.restaurant,
                        add: false
                    })
                } else {
                    this.setState({
                        add: true
                    });
                }

            })
            .catch(err => {
                console.log(err);
            });


    }

    onSubmit = (e) => {
        e.preventDefault();
        const api = '/restaurant/create'
        const data = new FormData();

        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile, this.state.selectedFile.name);
            axios.post('/img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log(response.data);
                    const body = {
                        name: this.state.name,
                        cuisine: this.state.cuisine,
                        zip: this.state.zip,
                        userId: this.props.auth.user.id,
                        data: {
                            img: response.data.location
                        }
                    }
                    axios
                        .post(api, body, this.tokenConfig())
                        .then(res => {
                            if (res.data.restaurant) {
                                this.setState({
                                    restaurant: res.data.restaurant,
                                    name: res.data.restaurant.name,
                                    cuisine: res.data.restaurant.cuisine,
                                    zip: res.data.restaurant.zip,
                                    imgSrc: res.data.restaurant.data.img,
                                    add: false,
                                    selectedFile: null
                                })
                            } else {
                                this.setState({
                                    add: true
                                });
                            }

                        })
                        .catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.log(err);
                });
        }
    }

    onUpdate = (e) => {
        e.preventDefault();
        const api = '/restaurant/update'
        const data = new FormData();
        console.log(this.state);

        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile, this.state.selectedFile.name);
            axios.post('/img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log(response.data);
                    const body = {
                        params: {
                            name: this.state.name ? this.state.name : this.state.restaurant.name,
                            cuisine: this.state.cuisine ? this.state.cuisine : this.state.restaurant.cuisine,
                            zip: this.state.zip ? this.state.zip : this.state.restaurant.zip,
                            data: {
                                img: response.data.location
                            }
                        },
                        where: {
                            id: this.state.restaurant.id
                        }
                    }
                    axios
                        .post(api, body, this.tokenConfig())
                        .then(res => {
                            if (res.data.restaurant) {
                                this.setState({
                                    restaurant: res.data.restaurant,
                                    name: res.data.restaurant.name,
                                    cuisine: res.data.restaurant.cuisine,
                                    zip: res.data.restaurant.zip,
                                    imgSrc: res.data.restaurant.data.img,
                                    edit: false,
                                    selectedFile: null
                                })
                            } else {
                                this.setState({
                                    edit: true
                                });
                            }

                        })
                        .catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.log(err);
                });
        } else {
            const body = {
                params: {
                    name: this.state.name ? this.state.name : this.state.restaurant.name,
                    cuisine: this.state.cuisine ? this.state.cuisine : this.state.restaurant.cuisine,
                    zip: this.state.zip ? this.state.zip : this.state.restaurant.zip,
                },
                where: {
                    id: this.state.restaurant.id
                }
            }
            axios
                .post(api, body, this.tokenConfig())
                .then(res => {
                    if (res.data.restaurant) {
                        console.log(this.state);
                        this.setState({
                            restaurant: res.data.restaurant,
                            name: res.data.restaurant.name,
                            cuisine: res.data.restaurant.cuisine,
                            zip: res.data.restaurant.zip,
                            imgSrc: res.data.restaurant.data.img,
                            edit: false,
                            selectedFile: null
                        })
                    } else {
                        console.log(this.state);
                        this.setState({
                            edit: true
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        console.log("rest=> " + this.state.restaurant);
        if (this.props.auth.user.id && !this.state.restaurant)
            this.getRestaurantDetails();
    }

    render() {
        console.log(this.state);
        if (!this.state.restaurant) {
            return (<div className="app flex-row align-items-center">
                <Container style={{ marginTop: 100 + 'px' }}>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">
                            <Card className="mx-4">
                                <CardBody className="p-4">
                                    <Form onSubmit={this.onSubmit}>
                                        <h2 className="Segoe UI">Restaurant Registration</h2>
                                        <p className="text-muted">Add your restaurant</p>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <MdAccountBalance />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type='text'
                                                name='name'
                                                id='name'
                                                placeholder='Enter Restaurant name'
                                                value={this.state.name}
                                                onChange={this.onChange}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <MdImage />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="file" onChange={this.singleFileChangedHandler}
                                                name='img'
                                                id='img'
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>

                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="select" name='cuisine' id='cuisine' onChange={this.onChange} value={this.state.cuisine}>
                                                <option selected value="INDIAN">Indian</option>
                                                <option value="FASTFOOD">Fast Food</option>
                                                <option value="ASIAN">Asian</option>
                                                <option value="MEXICAN">Mexican</option>
                                                <option value="ITALIAN">Italian</option>
                                            </Input>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type='text'
                                                name='zip'
                                                id='zip'
                                                placeholder='Zip Code'
                                                pattern="[0-9]{5}"
                                                placeholder='Enter ZIP Code'
                                                value={this.state.zip}
                                                onChange={this.onChange}
                                            />
                                        </InputGroup>

                                        <Button color="success" block>Create Restaurant</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>);
        }

        else {
            if (!this.state.edit) {
                return (<div className="app flex-row align-items-center">
                    <Container style={{ marginTop: 100 + 'px' , "maxWidth":"none"}}>
                        <Row className="justify-content-center">
                            <Col>
                                <Card className="text-center">
                                    <CardHeader>
                                        <h1>{this.state.restaurant.name ? this.state.restaurant.name : ''}</h1>
                                        <p className="text-muted">An {this.state.restaurant.cuisine.toLowerCase()} restaurant located in {this.state.restaurant.zip}</p>
                                    </CardHeader>
                                    <CardBody className="p-0">
                                        {this.state.restaurant.data && this.state.restaurant.data.img ?
                                            (<div style={{background: `url(${this.state.restaurant.data.img})`, backgroundPosition:'center',left:0,right:0}}><div style={{left:0,right:0,height:200+'px'}}></div></div>) : (<MdRestaurant />)}
                                    </CardBody>
                                    <CardFooter>
                                        <Button color="primary" onClick={(e) => {

                                            this.setState({
                                                edit: true
                                            })
                                        }} className="btn btn-primary btn-lg btn-block" aria-label="Edit">Edit</Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Menu restaurant={this.state.restaurant} />
                        </Row>
                    </Container>
                </div>);
            }
            else {
                return (<div className="app flex-row align-items-center">
                    <Container style={{ marginTop: 100 + 'px', "maxWidth" : "none" }}>
                        <Row className="justify-content-center">
                            <Col md="9" lg="7" xl="6">
                                <Card className="mx-4">
                                    <CardBody className="p-4">
                                        <Form onSubmit={this.onUpdate}>
                                            <h2 className="Segoe UI">Restaurant </h2>
                                            <p className="text-muted">Edit your restaurant</p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <MdAccountBalance />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    type='text'
                                                    name='name'
                                                    id='name'
                                                    placeholder={this.state.restaurant.name}
                                                    value={this.state.name}
                                                    onChange={this.onChange}
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <MdImage/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    type="file" onChange={this.singleFileChangedHandler}
                                                    name='img'
                                                    id='img'
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>

                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="select" name='cuisine' id='cuisine' placeholder={this.state.restaurant.cuisine} onChange={this.onChange} value={this.state.cuisine}>
                                                    <option value="INDIAN">Indian</option>
                                                    <option value="FASTFOOD">Fast Food</option>
                                                    <option value="ASIAN">Asian</option>
                                                    <option value="MEXICAN">Mexican</option>
                                                    <option value="ITALIAN">Italian</option>
                                                </Input>
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    type='text'
                                                    name='zip'
                                                    id='zip'
                                                    placeholder='Zip Code'
                                                    pattern="[0-9]{5}"
                                                    placeholder={this.state.restaurant.zip}
                                                    value={this.state.zip}
                                                    onChange={this.onChange}
                                                />
                                            </InputGroup>

                                            <Button color="success" block>Update Restaurant</Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>);
            }

        }


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