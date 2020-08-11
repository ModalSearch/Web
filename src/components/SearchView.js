import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import ItemList from './ItemList';


export default class SearchView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: undefined,
            inputActive: false,
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
            // this.setState({response: JSON.stringify(data)})
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
        return (
            <div>
                <div style={{
                    backgroundColor: 'var(--base01)',
                    padding: 10,
                    display: 'flex'
                }}>
                    <input autoFocus type="text" style={{
                        width: '100%'
                    }} onChange={(e) => {
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
                        value={this.state.liveInput}/>
                </div>
                <div>
                    <ItemList data={this.state.resultsData}/>
                </div>
            </div>
        );
    }
}
