import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Badge, Table, Row, CardHeader } from 'reactstrap';
import restaurant from './Restaurant';

import moment from 'moment-timezone';
import _ from 'lodash';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Order extends Component {

    state = {
        orders: null
    }

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


    getSingleOrderView = (order) => {
        let color = {
            'NEW': 'danger',
            'PREPARING': 'warning',
            'READY': 'primary',
            'DELIVERED': 'success',
            'CANCELLED': 'secondary'
        }
        let items = order.data.items.map(item => (
            <tr key={item.id}>
                <td width='42%'>
                    {item.name}
                </td>
                <td width='40%' className='text-right'>
                    {item.quantity}  x  ${item.price}    =    ${item.quantity * item.price}
                </td>

            </tr>
        ));
        return (<Col key={order.id} className="col-7 p-5">
            <Card className="mx-6 p-1">
                <CardHeader>
                    <Row>
                        <Col>
                            <h5 >Order # {order.id}</h5>
                        </Col>
                        <Col className='text-right'>
                            <h5><Badge color={color[order.status]}>{order.status}</Badge></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='col-6'>
                            <p className="text-muted">Created: {moment(order.createdAt).format('MMM DD, YYYY')}<br/>{moment(order.createdAt).format('h:mm A')}</p>
                        </Col>
                        
                        <Col className='text-right col-6'>
                            <p className="text-muted">Updated: {moment(order.updatedAt).format('MMM DD, YYYY')}<br/>{moment(order.updatedAt).format('h:mm A')}</p>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <Row>
                                <Table className="table table-hover">
                                    {items}

                                </Table>
                            </Row>
                            <Row>
                                <Table className="table table-hover">
                                    <thead>
                                        <th width='60%'>
                                            <strong>Total</strong>
                                        </th>
                                        <th width='40%' className='text-right'>
                                            ${order.total}
                                        </th>
                                    </thead>

                                </Table>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Table className="table table-hover">
                                    <thead>
                                        <th className='text-right'><strong>{this.props.auth.user.name}</strong></th>
                                    </thead>

                                </Table>
                            </Row>
                            <Row>
                                <Table className="table table-hover">
                                    <thead>
                                        <th className='text-right'><address>
                                            {order.deliveryAddress.address}<br />
                                            {order.deliveryAddress.city}<br />
                                            {order.deliveryAddress.state}-{order.deliveryAddress.zip}
                                        </address></th>
                                    </thead>

                                </Table>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    {(order.status == 'CANCELLED' || order.status == 'DELIVERED')?(<br/>):(<Button color='danger' block onClick={this.cancelOrder.bind(this, order.id)}>Cancel Order</Button>)}
                </CardFooter>
            </Card>
        </Col>);
    }

    cancelOrder = (id) => {
        axios.post('/order/cancel/' + id, {userId:this.props.auth.user.id}, this.tokenConfig()).then(res => {
            if (res.data.orders) {
                this.setState({
                    orders: res.data.orders
                });
            }
        })
            .catch(err => {
                console.log(err);
            });
    }


    getOrderPageView = () => {
        //let orderGroups = this.state.orders.map(order => order.status);
        let orderGroups = ['NEW',
        'PREPARING',
        'READY',
        'DELIVERED',
        'CANCELLED'];
        let orderCards = Array.from(new Set(orderGroups)).map((group) => (
            <Container key={group} >
                    <Row className="justify-content-right">
                        <h1>{group}</h1>
                    </Row>
                    <Row>
                        {this.state.orders.filter(order => order.status == group)
                            .map((order) => {

                                return this.getSingleOrderView(order);

                            })}
                    </Row>
            </Container>
        ));

        return (<Container>

            {orderCards}

        </Container>)


    }

    componentDidMount() {
        if (this.state.orders == null) {

            axios
                .get('/order/getByUser/' + this.props.auth.user.id, this.tokenConfig())
                .then(res => {
                    if (res.data.orders) {
                        this.setState({
                            orders: res.data.orders
                        })
                    }


                })
                .catch(err => {
                    console.log(err);
                });

        }
    }

    render() {

        return (
            <div>
                <Container>
                    {(this.state.orders && _.isArray(this.state.orders) && this.state.orders.length > 0) ? this.getOrderPageView()
                        : <h2>You have no current or past orders</h2>}
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
)(Order);