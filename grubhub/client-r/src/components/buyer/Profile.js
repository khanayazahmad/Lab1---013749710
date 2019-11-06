import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, CardImg, Badge, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';
import { register, loadUser } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { MdAccountBalance, MdRestaurant, MdImage, MdEmail} from "react-icons/md";

import { FiCheckCircle } from "react-icons/fi";
class Profile extends Component {
    state = {
        user:this.props.auth.user,
        edit: false,
        name: '',
        email: '',
        selectedFile: null
    };

    static propTypes = {
        auth: PropTypes.object.isRequired
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    singleFileChangedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
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

    getProfileView = () => {
        return (
            <Card className="mx-4" >
                <CardHeader>
                    <Row>
                        <Col className="col-8">
                            <h4>{this.state.user.name}</h4>
                        </Col>
                        <Col className="text-right">
                            <h4><Badge color="success">CUSTOMER</Badge></h4>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody className='p-0'>

                    {this.state.user.data && this.state.user.data.img ? (<CardImg src={this.state.user.data.img} height={600} width={200}></CardImg>) : (<MdAccountBalance />)}
                </CardBody>
                <CardFooter>
                    <Row>
                        <Col xs="6">
                            <p className="text-muted"><strong>Email</strong></p>
                        </Col>
                        <Col xs="6" className="text-right">
                            <p className="text-muted"><strong>{this.state.user.email}</strong></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="6">
                            <Button color="primary" className="px-1" onClick={(e) => {

                                this.setState({
                                    edit: true
                                })
                            }} block>Edit Profile</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                            <Button onClick={this.deleteAccount} color="danger" className="px-1" block>Delete Account</Button>
                        </Col>
                    </Row>
                </CardFooter>
            </Card>);
    }

    onSubmit = e => {
        e.preventDefault();




        const newUser = {
            id: this.state.user.id,
            name: this.state.name ? this.state.name : this.state.user.name,
            email: this.state.email ? this.state.email : this.state.user.email
        };

        console.log(newUser)


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

                    newUser.data = {
                        img: response.data.location
                    }

                    axios
                        .post('/user/update',newUser, this.tokenConfig())
                        .then(res => {
                            console.log(res.data);
                            if (res.data.user) {
                                alert("Profile updated successfully");
                                store.dispatch(loadUser());
                                this.setState({
                                    edit:false,
                                    user:res.data.user
                                });
                            }

                        })
                        .catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.log(err);
                });
        }else{

            newUser.data = this.state.user.data;
            console.log(newUser)
            axios
                .post('/user/update',newUser, this.tokenConfig())
                .then(res => {
                    if (res.data.user) {
                        alert("Profile updated successfully");
                                store.dispatch(loadUser());
                                this.setState({
                                    edit:false,
                                    user:res.data.user
                                });
                    }

                })
                .catch(err => {
                    console.log(err);
                });

        }
    };

    getEditView = () => {
        return (<div className="app flex-row align-items-center">
            <Container style={{ marginTop: 100 + 'px' }}>
                <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="6">
                        <Card className="mx-4">
                            <CardBody className="p-4">
                                <Form onSubmit={this.onSubmit}>
                                    <Row>
                                    <Col><h1>Profile</h1></Col>
                                    <Col className="text-right">
                                        <Button color="danger" outline onClick={(e)=>{
                                            this.setState({
                                                edit:false
                                            })
                                        }}>x</Button>
                                    </Col>
                                    </Row>
                                    <p className="text-muted">Edit your Profile</p>
                                    <InputGroup className="mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                            <MdAccountBalance/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            type='text'
                                            name='name'
                                            id='name'
                                            placeholder={this.state.user.name}
                                            onChange={this.onChange}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><MdEmail/></InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            type='email'
                                            name='email'
                                            id='email'
                                            placeholder={this.state.user.email}
                                            onChange={this.onChange}
                                        />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                   <MdImage/> Profile Image
                                    </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="file" onChange={this.singleFileChangedHandler}
                                                name='img'
                                                id='img'
                                            />
                                        </InputGroup>
                                    <Button color="success" block>Update Profile</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>);
    }


    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        let content = (this.state.edit)?(this.getEditView()):(this.getProfileView())

        return (content);
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(
    mapStateToProps,
    { register, clearErrors }
)(Profile);
