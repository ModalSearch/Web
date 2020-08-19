import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
// import ItemList from './ItemList';
import Result from './Result';
import SchemaControls from './SchemaControls';
// import ResultsView from './ResultsView';
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
            resultItems: [],
            resultSchema: undefined,
            viewSchema: undefined
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
                resultItems: response.data,
                resultSchema: response.schema,
                viewSchema: response.schema
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
        const { resultItems, resultSchema, viewSchema, inputFocussed } = this.state;
        return (
            <div>
                <div style={{
                    backgroundColor: theme.base02,
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
                            backgroundColor: theme.base01,
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
                <div style={{padding: 10, paddingTop: 0}}>
                    {resultSchema === undefined || resultItems === undefined ? (
                        <div style={{width: '100%', textAlign: 'center'}}>
                            {this.state.wsConnected ? (
                                <div className="lds">{[...Array(3).keys()].map(_ => <div style={{background: theme.base02}}></div>)}</div>
                            ) : <div>Waiting to connect...</div>}
                        </div>
                    ) :
                        (resultItems.length > 0 ?
                            <div>
                                <SchemaControls baseSchema={resultSchema} activeSchema={viewSchema} theme={theme}
                                    onChange={(e) => {
                                        let ns = JSON.parse(JSON.stringify(viewSchema))
                                        if (!e.target.checked) {
                                            console.log(e.target.name)
                                            delete ns.properties[e.target.name]
                                        } else {
                                            ns.properties[e.target.name] = resultSchema.properties[e.target.name]
                                        }
                                        this.setState({
                                            viewSchema: ns
                                        })
                                    }} />
                                {resultItems.slice(0, 50).map((item) => <Result key={item.id} item={item} theme={theme} schema={viewSchema}></Result>)}
                            </div> :
                            <div style={{
                                paddingTop: 30,
                                width: '100%',
                                textAlign: 'center',
                                verticalAlign: 'center'
                            }}>No Results :(</div>
                        )
                    }
                </div>
            </div>
        );
    }
}
