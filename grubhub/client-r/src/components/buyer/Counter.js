import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';

class Counter extends Component {
    state = {
        value: this.props.value?this.props.value:1
    }

    handleIncrement = () => {
        let val = this.state.value + 1;
        this.setState({
            value: val
        });
        this.props.updateCounter(val);
    }

    handleDecrement = () => {
        let val = this.state.value - 1;
        this.setState({
            value: val < 0 ? 0 : val
        });
        this.props.updateCounter(val < 0 ? 0 : val);
    }



    render() {
        return (<Container>
            <Row>
                <Col className='col-3 text-left'>
                    <Button onClick={this.handleIncrement} color="warning">+</Button>
                </Col>
                <Col className='col-6 text-right'>
                    <p>{this.state.value}</p>
                </Col>
                <Col className='col-3 text-right'>
                    <Button onClick={this.handleDecrement} color="warning">-</Button>
                </Col>
            </Row>
        </Container>)
    }
}
export default Counter;