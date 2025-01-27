import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { MdAccountBalance, MdRestaurant, MdImage,  } from "react-icons/md";
import { graphql, compose } from 'react-apollo';
import { REGISTER_USER_MUTATION } from '../../queries'

import { FiCheckCircle  } from "react-icons/fi";
class RegisterModal extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    role: '',
    password: '',
    msg: null
  };



  componentDidUpdate(prevProps) {
    const { REGISTER_USER_MUTATION } = this.props;
    console.log(REGISTER_USER_MUTATION)



  }



  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, email, password } = this.state;

    
    const newUser = {
      name,
      email,
      role: this.props.role,
      password,
    };
    console.log(newUser);
    this.props.REGISTER_USER_MUTATION({
      variables: newUser
    })
  };

  render() {
    console.log(this.state.modal)
    if(this.state.modal){
      return (
<div className="app flex-row align-items-center">
        <Container style={{marginTop:100+'px'}}>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="9">
              <Card className="mx-4">
                <CardHeader>
                  <h2 color = 'grey'>
                    <FiCheckCircle color='green' />  <strong> {' You have been successfully registered '}</strong>
                  </h2>
                </CardHeader>
                <CardFooter>
                <Row style={{marginTop:5+'px'}}>
                  <Col xs="6">

                  </Col>
                          <Col xs="6" className="text-right">
                          <Link to="/login">
                              <Button Button color="link" className="px-0">Go to Sign In ...</Button>
                          </Link>
                          </Col>
                        </Row>
                </CardFooter>
              </Card>
              </Col>
              </Row>
              </Container>
              </div>

      )
    }

    return (
      <div className="app flex-row align-items-center">
        <Container style={{marginTop:100+'px'}}>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.onSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Name'
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Email'
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password'
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='r-password'
                        name='r-password'
                        id='r-password'
                        placeholder='Confirm Password'
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    <Button color="success" block>Create Account</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default compose(
  graphql(REGISTER_USER_MUTATION, { name: "REGISTER_USER_MUTATION" })
)(RegisterModal);
