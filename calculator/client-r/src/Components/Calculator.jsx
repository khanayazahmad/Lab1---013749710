import React, {Component} from 'react';
import axios from 'axios'

import CalKeyBoard from './CalKeyBoard'
import DisplayPanel from './DisplayPanel'

class Calculator extends Component {

    state = {
        calKeys:[
            1,2,3,4,5,6,7,8,9,0
        ],
        displayValue:0,
        prevVal:0,
        signVal:''
    }

    tokenConfig = () => {

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        return config;
    };

    handleKey = (val) => {
        let displayVal = "" + this.state.displayValue;
        displayVal += val;
        this.setState({ displayValue:displayVal});
    }

    handleCKey =() => {
        this.setState({displayValue:0})
    }

    handleSignKey =(sign) =>{
        this.setState({prevVal: this.state.displayValue, displayValue:0, signVal:sign});
    }

    handleEqualsKey= () =>{

        axios.post('/calculate', 
        {
            signVal:this.state.signVal,
            prevVal:this.state.prevVal,
            displayValue:this.state.displayValue

        }, 
        this.tokenConfig()
        ).then(res => {
            if (res.data.result) {
                this.setState({displayValue: res.data.result})
            }
        })
            .catch(err => {
                console.log(err);
            });

        
    }

    render() {
        return (
            <div>
            <DisplayPanel val={this.state.displayValue}/>
            <CalKeyBoard calKeys={this.state.calKeys}
                         onKey={this.handleKey}
                         onCKey={this.handleCKey}
                         onSignKey={this.handleSignKey}
                         onEqualsKey={this.handleEqualsKey}
            />
            </div>
        );
    }
}

export default Calculator;
