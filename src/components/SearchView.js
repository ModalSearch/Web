import React from 'react';
import socketIOClient from "socket.io-client";

import ResultsView from './ResultsView';
import queryString from 'querystring';
import '../styles/loader.css';

export default class SearchView extends React.Component {

    constructor(props) {
        super(props);
        const query_params = queryString.parse(window.location.search.slice(1));
        console.log('QP:', query_params.q)
        this.state = {
            response: undefined,
            inputActive: false,
            inputFocussed: false,
            wsConnected: false,
            typingTimeout: 0,
            query: query_params.q !== undefined ? query_params.q : '',
            liveInput: query_params.q !== undefined ? query_params.q : '',
            resultGroups: [],
        };
        this.socket = socketIOClient(this.props.api_url);
        this.request_data();
    }

    componentDidMount() {
        this.socket.on('connect', () => {
            console.log('WS Connected.');
            this.setState({ wsConnected: true });
        });

        this.socket.on('disconnect', () => {
            console.log('WS Disconnected.');
            this.setState({ wsConnected: false });
        });

        this.socket.on('search_data', (response) => {
            console.log('Recieved:', response);
            this.setState({
                resultGroups: response.results
            });
            if (response.original_query.trim() !== '') {
                window.history.replaceState({}, 'Modal Search', `/?q=${response.original_query}`);
            } else {
                window.history.replaceState({}, 'Modal Search', '/');
            }
        });
    }

    request_data() {
        const { query, activeSchema } = this.state;
        console.log('Fetching for:', query, activeSchema);
        this.socket.emit('search', {
            query: query,
            schema: activeSchema
        });
    }

    render() {
        const { theme } = this.props;
        const { resultGroups, inputFocussed } = this.state;
        return (
            <div>
                <div style={{
                    backgroundColor: theme.base01,
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: 10,
                    paddingBottom: 10
                }}>
                    <input autoFocus
                        type="text"
                        onFocus={() => this.setState({ inputFocussed: true })}
                        onBlur={() => this.setState({ inputFocussed: false })}
                        style={{
                            width: '100%',
                            display: 'block',
                            padding: 5,
                            backgroundColor: theme.base00,
                            border: 'solid 1px',
                            borderColor: this.state.wsConnected ? theme.base00 : theme.base0F,
                            outlineStyle: inputFocussed && this.state.wsConnected ? 'solid' : 'none',
                            outlineColor: theme.base03,
                            fontSize: 18,
                            borderRadius: 3,
                            color: theme.base05,
                            pointerEvents: this.state.wsConnected ? 'auto' : 'none'
                        }}
                        placeholder={!this.state.wsConnected ? "Connecting..." : "Search"}
                        readOnly={!this.state.wsConnected}
                        onChange={(e) => {
                            if (this.state.typingTimeout) {
                                clearTimeout(this.state.typingTimeout);
                            }
                            this.setState({
                                inputActive: false,
                                typingTimeout: setTimeout(() => {
                                    this.setState({ query: this.state.liveInput });
                                    this.request_data();
                                }, 500),
                                liveInput: e.target.value
                            });
                        }}
                        value={this.state.liveInput}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 10
                }}>
                    <ResultsView theme={theme} data={resultGroups}/>
                </div>
            </div>
        );
    }
}
