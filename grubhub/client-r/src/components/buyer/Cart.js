import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardImg, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, Badge, Table } from 'reactstrap';

import { IoIosCart } from "react-icons/io";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Restaurant from './Restaurant';
import Counter from './Counter';
import { FiCheckCircle } from "react-icons/fi";

class Cart extends Component {
    state = {
        cart: null,
        address: null,
        city: null,
        state: null,
        zip: null,
        checkout: false,
        checkoutSuccess: false,
        order: null
    };

    static propTypes = {
        auth: PropTypes.object.isRequired
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
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

    updateCart = (val, item) => {
        let ucart = this.state.cart;
        ucart.data.items = ucart.data.items.map(i => {
            if (item.id == i.id) {
                ucart.total += (val - i.quantity) * i.price;
                i.quantity = val;
            }
            return i;

        }).filter(i => i.quantity != 0);

        axios
            .post('/cart/update', {
                id: ucart.id,
                data: ucart.data,
                total: ucart.total
            }, this.tokenConfig())
            .then(res => {
                if (res.data.cart) {
                    this.setState({
                        cart: res.data.cart
                    })
                }

            })
            .catch(err => {
                console.log(err);
            });

    }

    placeOrder = (e) => {
        e.preventDefault();

        let order = {
            total: this.state.cart.total,
            deliveryAddress: {
                address: this.state.address,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip

            },
            data: {
                items: this.state.cart.data.items
            },
            userId: this.state.cart.userId,
            restaurantId: this.state.cart.restaurantId

        };
        axios
            .post('/order/create', order, this.tokenConfig())
            .then(res => {
                if (res.data.order) {

                    axios
                        .post('/cart/update', {
                            id: this.state.cart.id,
                            data: { items: [] },
                            total: 0
                        }, this.tokenConfig())
                        .then(res => {
                            if (res.data.cart) {
                                this.setState({
                                    cart: res.data.cart,
                                    order: res.data.order,
                                    checkout: false,
                                    checkoutSuccess: true
                                })
                            }

                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

            })
            .catch(err => {
                console.log(err);
            });

    }

    getCheckoutSuccessView = () => {
        return (<div className="app flex-row align-items-center">
            <Container style={{ marginTop: 100 + 'px' }}>
                <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="9">
                        <Card className="mx-4">
                            <CardHeader>
                                <h2 color='grey'>
                                    <FiCheckCircle color='green' />  <strong> {' Your order has been successfully placed! '}</strong>
                                </h2>
                            </CardHeader>
                            <CardFooter>
                                <Row style={{ marginTop: 5 + 'px' }}>
                                    <Col xs="6">

                                    </Col>
                                    <Col xs="6" className="text-right">
                                        <Link to="#">
                                            <Button color="link" className="px-0">Go Back ...</Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>)
    }

    getCheckoutView = () => {
        return (<div className="app flex-row align-items-center">
            <Container style={{ marginTop: 100 + 'px' }}>
                <Row><Col>
                    <Card className="mx-4">
                        <CardBody className="p-4">
                            <Form onSubmit={this.placeOrder}>
                                <h3>Shipping Address</h3>
                                <InputGroup className="mb-3">

                                    <Input type="text" id="address" name="address" placeholder="Address" onChange={this.onChange} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <Input type="text" id="city" name="city" placeholder="City" onChange={this.onChange} />
                                </InputGroup>
                                <Row>
                                    <Col className="col-50">
                                        <InputGroup className="mb-3">
                                            <Input type="text" id="state" name="state" placeholder="State" onChange={this.onChange} />
                                        </InputGroup>
                                    </Col>
                                    <Col className="col-50">
                                        <InputGroup className="mb-3">
                                            <Input type="text" id="zip" name="zip" placeholder="Zip" onChange={this.onChange} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>

                                    <Button color="success" className="px-1" block >Place your Order</Button>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                    <Col>
                        {this.getCartList()}
                    </Col>
                </Row>
            </Container>
        </div>)
    }

    getCartList = () => {
        let items = this.state.cart.data.items.map(item => (
            <tr key={item.id}>
                <td width='42%'>
                    {item.name}
                </td>
                <td width='40%' className='text-right'>
                    {item.quantity}  x  ${item.price}    =    ${item.quantity * item.price}
                </td>

            </tr>
        ));

        return (<Container>
            <h3>Cart Summary</h3>
            <Table className="table table-hover">
                <tbody>
                    {items}
                </tbody>

            </Table>

            <Table className="table table-hover">
                <thead>
                    <th width='60%'>
                        <strong>Total</strong>
                    </th>
                    <th width='40%' className='text-right'>
                        ${this.state.cart.total}
                    </th>
                </thead>

            </Table>
            <Button color='link' onClick={() => {
                this.setState({
                    checkout: false,
                    checkoutSuccess: false
                })
            }}>Edit your cart ...</Button>
        </Container>)

    }

    getCartView = () => {
        let items = this.state.cart.data.items.map(item => (
            <tr key={item.id}>
                <td width='42%'>
                    {item.name}
                </td>
                <td width='18%'>
                    <Counter
                        value={item.quantity}
                        updateCounter={(val) => {
                            this.updateCart(val, item);
                        }}
                    />
                </td>
                <td width='40%' className='text-right'>
                    {item.quantity}  x  ${item.price}    =    ${item.quantity * item.price}
                </td>

            </tr>
        ));

        return (<Card className="mx-4" >
            <CardHeader>
                <Row className='p-3'>

                    <Col>
                        <h3><strong>Cart</strong></h3>
                    </Col>
                    <Col className='text-right'>
                        <IoIosCart color='green' size={40} />
                    </Col>
                </Row>
            </CardHeader>


            <CardBody>
                <Table className="table table-hover">
                    <tbody>
                        {items}
                    </tbody>

                </Table>

                <Table className="table table-hover">
                    <thead>
                        <th width='60%'>
                            <strong>Total</strong>
                        </th>
                        <th width='40%' className='text-right'>
                            ${this.state.cart.total}
                        </th>
                    </thead>

                </Table>
            </CardBody>

            <CardFooter>


                <Row>

                    <Button onClick={() => {
                        this.setState({
                            checkout: true
                        })
                    }} color="success" className="px-1" block >Proceed to Checkout</Button>
                </Row>
            </CardFooter>
        </Card>)
    }

    componentDidMount() {
        if (this.state.cart == null) {

            axios
                .get('/cart/getByUser/' + this.props.auth.user.id, this.tokenConfig())
                .then(res => {
                    if (res.data.cart) {
                        this.setState({
                            cart: res.data.cart,
                            checkoutSucces: false
                        })
                    }


                })
                .catch(err => {
                    console.log(err);
                });
        }
    }




    render() {
        if (this.state.checkout) {
            return (<Container>
                {this.getCheckoutView()}
            </Container>)
        }

        if (this.state.checkoutSuccess) {
            return (<Container>
                {this.getCheckoutSuccessView()}
            </Container>)
        }

        if (!(this.state.cart && this.state.cart.data && this.state.cart.data.items) || this.state.cart.data.items.length == 0) {
            return (<div>
                <h2>Your cart is empty</h2>
            </div>)
        }

        return (
            <div>
                <Container>
                    {this.getCartView()}
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
)(Cart);
