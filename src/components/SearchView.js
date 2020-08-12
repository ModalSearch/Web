import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import ItemList from './ItemList';


export default class SearchView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: undefined,
            inputActive: false,
            wsConnected: false,
            typingTimeout: 0,
            query: '',
            liveInput: '',
            resultsData: [],
        };
        this.socket = socketIOClient(this.props.api_url);
    }

    componentDidMount() {
        this.socket.on('connect', () => {
            console.log('WS Connected.');
            this.setState({wsConnected: true});
        });
        
        this.socket.on('disconnect', () => {
            console.log('WS Disconnected.');
            this.setState({wsConnected: false});
        });
        
        this.socket.on('search_data', (resultsData) => {
            console.log(resultsData);
            this.setState({resultsData});
        });
    }

    request_data() {
        const { query } = this.state;
        console.log('Fetching for:', query);
        this.socket.emit('search', query);
    }

    render() {
        const { theme } = this.props;
        return (
            <div>
                <div style={{
                    // backgroundColor: 'var(--base01)',
                    backgroundColor: theme.base01,
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    <input autoFocus 
                        type="text"
                        style={{
                            width: '100%',
                            display: 'block',
                            margin: 10
                         }} 
                        onChange={(e) => {
                            if (this.state.typingTimeout) {
                                clearTimeout(this.state.typingTimeout);
                            }
                            this.setState({
                                inputActive: false,
                                typingTimeout: setTimeout(() => {
                                    this.setState({query: this.state.liveInput});
                                    this.request_data();
                                }, 500),
                                liveInput: e.target.value
                            });
                        }} 
                        value={this.state.liveInput}
                    />
                    <div style={{
                        color: this.state.wsConnected ? theme.base03 : theme.base0F,
                        marginRight: 10,
                        marginBottom: 5,
                        width: '100%',
                        textAlign: 'right'
                    }}>
                        {this.state.wsConnected ? 'WS Connected' : 'Waiting to connect...'}
                    </div>

                </div>
                <div>
                    <ItemList theme={theme} data={this.state.resultsData}/>
                </div>
            </div>
        );
    }
}
