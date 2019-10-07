import React, {Component} from 'react';
import {Button, Row, Col, Container} from 'reactstrap';

class CalKeyBoard extends Component {


    render() {
        return (
            <Container>
                <Button onClick={()=>this.props.onKey(this.props.calKeys[0])}
                        color="primary" outline block >{this.props.calKeys[0]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[1])}
                        color="primary" outline block >{this.props.calKeys[1]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[2])}
                        color="primary" outline block >{this.props.calKeys[2]}</Button>
                <Button onClick={() => this.props.onSignKey('+')}
                        color="primary" outline block >+</Button>
                <br/>
                <Button onClick={() => this.props.onKey(this.props.calKeys[3])}
                        color="primary" outline block >{this.props.calKeys[3]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[4])}
                        color="primary" outline block >{this.props.calKeys[4]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[5])}
                        color="primary" outline block >{this.props.calKeys[5]}</Button>
                <Button onClick={() => this.props.onSignKey('-')}
                        color="primary" outline block >-</Button>
                <br/>
                <Button onClick={() => this.props.onKey(this.props.calKeys[6])}
                        color="primary" outline block >{this.props.calKeys[6]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[7])}
                        color="primary" outline block >{this.props.calKeys[7]}</Button>
                <Button onClick={() => this.props.onKey(this.props.calKeys[8])}
                        color="primary" outline block >{this.props.calKeys[8]}</Button>
                <Button onClick={() => this.props.onSignKey('*')}
                        color="primary" outline block >*</Button>
                <br/>
                <Button onClick={() => this.props.onKey(this.props.calKeys[9])}
                        color="primary" outline block >{this.props.calKeys[9]}</Button>
                <Button onClick={() => this.props.onKey(".")}
                        color="primary" outline block >.</Button>
                <Button onClick={() => this.props.onEqualsKey()}
                        color="primary" outline block >=</Button>
                <Button onClick={() => this.props.onSignKey('/')}
                        color="primary" outline block >/</Button>
                <br/>
                <Button onClick={() => this.props.onCKey()}
                        color="secondary" block style={{width:"102px"}}>C</Button>

            </Container>
        );
    }
}

export default CalKeyBoard;
