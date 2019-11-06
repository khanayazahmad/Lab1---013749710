import React, { Component } from "react";
import io from 'socket.io-client';
import axios from 'axios';
import { Launcher } from 'react-chat-window';
import moment from 'moment';

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            message: null,
            socket: null,
            channel: null,
            messages: [],
            isOpen: this.props.isOpen
        })
    }

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

    componentDidMount() {

        const socket = io('http://localhost:8081');

        this.setState({
            socket: socket,
            channel: this.props.channel
        }, () => {
            socket.emit('channel', this.state.channel);
            socket.on(this.state.channel, (message) => {
                const messages = this.state.messages;
                message = JSON.parse(message);
                let first_name = this.props.user.name
                messages.push({
                    author: first_name == message.sender ? "me" : "them", type: 'text', data: { text: message.message }
                });

                this.setState({
                    messages: messages,
                    isOpen:true
                })
            })
        })

        let first_name = this.props.user.name;
        axios.get(`/chat/${this.props.channel}`, this.tokenConfig())
            .then(response => {

                this.setState(
                    {
                        messages: response.data.messages.map(m => ({
                            author: first_name == m.sender ? "me" : "them", type: 'text', data: { text: m.message }
                        }))
                    }
                );
            })
            .catch(err => {
                console.error(err);
            });
        this.setState({ channel: this.props.channel })

    }

    handleSendMessage = (message) => {
        this.state.socket.emit(this.state.channel, JSON.stringify({
            message: message,
            sender: this.props.user.name,
            created_at: moment().format(),
        }));
    }

    _sendMessage(message) {
        if (message.data.text.length > 0) {
            this.handleSendMessage(message.data.text);
        }
    }

    render() {
        let messages = this.state.messages;
        return (<div>
            <Launcher
                key = {this.props.key}
                agentProfile={{
                    teamName: this.props.title?this.props.title:'GRUBHUB SUPPORT',
                    imageUrl: ''
                }}
                onMessageWasSent={this._sendMessage.bind(this)}
                messageList={messages}
                isOpen = {this.state.isOpen}
                showEmoji={false}
            />
        </div>)

    }
}

export default Chat