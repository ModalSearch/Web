import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
// import ItemList from './ItemList';
import Result from './Result';
import SchemaControls from './SchemaControls';
// import ResultsView from './ResultsView';
import queryString from 'querystring';

export default class SearchView extends React.Component {

    constructor(props) {
        super(props);
        const query_params = queryString.parse(window.location.search.slice(1));
        console.log('QP:', query_params.q)
        this.state = {
            response: undefined,
            inputActive: false,
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
            window.history.replaceState( {} , 'Modal Search', `/?q=${response.original_query}` );
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
        const { resultItems, resultSchema, viewSchema } = this.state;
        return (
            <div>
                <div style={{
                    backgroundColor: theme.base02,
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: 10,
                }}>
                    <input autoFocus
                        type="text"
                        style={{
                            width: '100%',
                            display: 'block',
                            // margin: 10,
                            padding: 5,
                            backgroundColor: theme.base01,
                            border: 'solid 1px',
                            borderColor: theme.base03,
                            fontSize: 16,
                            color: theme.base05
                        }}
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
                    <div style={{
                        color: this.state.wsConnected ? theme.base04 : theme.base0F,
                        width: '100%',
                        textAlign: 'right',
                        marginTop: 5
                    }}>
                        {this.state.wsConnected ? 'WS Connected' : 'Waiting to connect...'}
                    </div>

                </div>
                {resultSchema === undefined || resultItems === undefined ? <div>Loading...</div> :
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
                        }}/>
                        {resultItems.slice(0,50).map((item) => <Result key={item.id} item={item} theme={theme} schema={viewSchema}></Result>)}
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
        );
    }
}
