import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class LoginModal extends Component {
  state = {
    modal: false,
    email: '',
    password: '',
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: 'LOGIN_FAIL'});
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
      if (isAuthenticated) {
        this.setState({
          modal:true
        });
      }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
    if(this.state.modal){
      return <Redirect to="/"/>
    }

    return (

        <div className="app flex-row align-items-center">
          <Container style={{marginTop:100+'px'}}>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={this.onSubmit}>
                        <h1>Welcome Back!</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type='email' name='email' id='email' placeholder='Email' required autoComplete="email" onChange={this.onChange} />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type='password' name='password' id='password' placeholder='Password' required autoComplete="current-password" onChange={this.onChange} />
                        </InputGroup>
                        <Row>
                          <Col xs="12" className="text-center">
                          <Button color="primary" className="btn btn-primary btn-lg btn-block" aria-label="Sign in">Sign in</Button>
                          </Col>
                        </Row>
                        <Row style={{marginTop:15+'px'}}>
                          <Col xs="6">
                            <Link to="/register">
                              <Button color="link" className="px-0">Register Now!</Button>
                            </Link>
                          </Col>
                          <Col xs="6" className="text-right">
                          <Link to="/register_owner">
                              <Button Button color="link" className="px-0">Register as Restaurant Owner!</Button>
                          </Link>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(LoginModal);
