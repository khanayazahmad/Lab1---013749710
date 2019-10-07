import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';

class EditItem extends Component {
    state = {
        name: null,
        price: null,
        category: this.props.category,
        selectedFile: null
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value ? e.target.value : null });
    };

    onUpdate = e => {
        e.preventDefault();
        const data = new FormData();
        if (this.state.selectedFile) {
            data.append('image', this.state.selectedFile, this.state.selectedFile.name);
            axios.post('/img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'x-auth-token': localStorage.getItem('token')
                }
            })
                .then((response) => {

                    const body = {
                        params: {
                            name: this.state.name ? this.state.name : this.props.name,
                            category: this.state.category ? this.state.category : this.props.category,
                            price: this.state.price ? this.state.price : this.props.price,
                            image: response.data.location
                        },
                        where: {
                            id: this.props.id,
                            menuId: this.props.menuId
                        }
                    }

                    this.props.updateItem(body);

                }).catch(err => {
                    console.log(err);
                });
        } else {
            const body = {
                params: {
                    name: this.state.name ? this.state.name : this.props.name,
                    category: this.state.category ? this.state.category : this.props.category,
                    price: this.state.price ? this.state.price : this.props.price,
                },
                where: {
                    id: this.props.id,
                    menuId: this.props.menuId
                }
            }
            this.props.updateItem(body);
        }
    };
    singleFileChangedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    render() {
        return (<Col>
            <Card className="mx-4" >
                <CardHeader>
                    <h5 className="text-muted">Edit {this.props.name} ...</h5>
                </CardHeader>
                <CardFooter>
                    <Row>

                        <Form onSubmit={this.onUpdate}>

                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        #
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder={this.props.name}
                                    value={this.state.name}
                                    onChange={this.onChange}
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        $
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="number" step="0.01"
                                    name='price'
                                    id='price'
                                    placeholder={this.props.price}
                                    value={this.state.price}
                                    onChange={this.onChange}
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>

                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input type="select" name='category' id='category' onChange={this.onChange} value={this.state.category}>
                                    <option value="APPETIZER">Appetizer</option>
                                    <option value="BREAKFAST">Breakfast</option>
                                    <option value="LUNCH">Lunch</option>
                                </Input>
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        Item Image
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="file" onChange={this.singleFileChangedHandler}
                                    name='img'
                                    id='img'
                                />
                            </InputGroup>

                            <Button color="primary" block>Update</Button>
                        </Form>
                    </Row>
                </CardFooter>
            </Card>
        </Col>)
    }
}
export default EditItem;