import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader } from 'reactstrap';

class AddItem extends Component {
    state = {
        name: null,
        price: null,
        menuId: this.props.menuId,
        category: this.props.category,
        selectedFile: null
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value ? e.target.value : null });
    };

    onSubmit = e => {
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

                    this.props.addItem({ ...this.state, img: response.data.location });
                }).catch(err => {
                    console.log(err);
                });
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
                    <h5 className="text-muted">Add new item ...</h5>
                </CardHeader>
                <CardFooter>
                    <Row>

                        <Form onSubmit={this.onSubmit}>

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
                                    placeholder={'Enter Item name'}
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
                                    placeholder={'Enter Price'}
                                    value={this.state.price}
                                    onChange={this.onChange}
                                />
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

                            <Button color="success" block>Add</Button>
                        </Form>
                    </Row>
                </CardFooter>
            </Card>
        </Col>)
    }
}
export default AddItem;