import React from 'react';
import { BrowserRouter as Router, Route, useLocation, useHistory } from "react-router-dom";
import queryString from 'query-string';
import Inspector from 'react-json-inspector';

import '../styles/json_inspector.css';


function pformat(obj) {
    if (Array.isArray(obj)) {
        if (obj.length == 1) {
            return pformat(obj[0]);
        } else {
            return <div style={{
                minWidth: 200,
                flex: 1,
                minHeight: 100,
                height: 50,
                overflow: 'scroll',
                resize: 'both',
                padding: 10,
                backgroundColor: 'var(--base00)',
            }}>
                <Inspector data={obj} search={false} />

            </div>
        }
    } else if (typeof obj == 'number' || typeof obj == 'string' || typeof obj == 'boolean') {
        return obj;
    } else if (obj instanceof Object) {
        let x = {};
        Object.keys(obj).forEach((k) => {
            x[k] = pformat(obj[k]);
        });
        return JSON.stringify(x);
    } else {
        console.log('???', obj);
    }
}


class Summary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
    }
    componentDidMount() {
        fetch(`${this.props.api_url}/summary?query=${this.props.query}`).then(response => response.json()).then(data => this.setState({ data }));
    }


    render() {
        const summary_object = this.state.data;
        if (summary_object === undefined) {
            return <div>Loading Summary</div>
        }
        return (
            <div style={{
                display: 'flex',
                maxWidth: '100%',
                // overflow: 'hidden'
                }}>
                <table style={{
                    border: 'solid 1px var(--base02)',
                    backgroundColor: 'var(--base01)',
                    borderCollapse: 'collapse',
                    width: '100%',
                    flex: 1
                }}>
                    <tbody>
                        {Object.keys(summary_object).map((key, i) =>
                            <tr key={i} style={{
                                textAlign: 'left',
                                verticalAlign: 'top',
                                // backgroundColor: i % 2 == 0 ? 'var(--base01)' : 'var(--base02)',
                            }}>
                                <td style={{
                                    borderRight: 'solid 1px var(--base02)',
                                    padding: 10,
                                    fontWeight: 600,
                                }}>{key}:</td>
                                <td style={{
                                    padding: 10,
                                    // flex: 1
                                }}>{pformat(summary_object[key])}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        );
    }
}


function DataItem(data_obj) {
    const { data_id, timestamp, url, json_data } = data_obj;
    return (
        <div key={data_id} style={{
            marginTop: 10,
            backgroundColor: 'var(--base01)',
            padding: 10,
            color: 'var(--base05)',
            border: 'solid 1px var(--base02)'
        }}>
            <div>
                <a aria-label="id" style={{color: 'var(--base0D)'}} href={`/q?query=data_id = ${data_id}`}>@{data_id}</a><br />
                <span aria-label="timestamp">{timestamp}</span><br />
                <a aria-label="url" href={`/q?query=url = '${url}'`}>{url}</a>
            </div>
            <div style={{
                padding: 10,
                backgroundColor: 'var(--base00)',
                overflow: "hidden"
            }}>
                <Inspector data={json_data} search={false} />
            </div>
        </div>
    )
}


class ItemList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            query: props.query
        };
    }


    componentDidMount() {
        const { query } = this.state;
        fetch(`${this.props.api_url}/query?query=${query}`).then(response => response.json()).then(data => this.setState({ data }));
    }

    render() {
        const { query, data } = this.state;
        if (data === undefined) {
            return <div>Loading Data</div>
        }
        return (
            <div>
                {data.map(DataItem)}
            </div>
        );
    }
}

class QueryControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: props.query
        };
    }

    render() {
        return (
            <div style={{
                backgroundColor: 'var(--base01)',
                padding: 10,
                marginTop: 10,
                marginBottom: 10
            }}>
                <form onSubmit={(evt) => {
                    window.location.href = `/q?query=${encodeURIComponent(this.state.query)}`;
                    evt.preventDefault();
                }}>
                    <label>
                        Query:
                    <input type="text" value={this.state.query} onChange={(evt => {
                            this.setState({
                                query: evt.target.value
                            })
                        })} />
                    </label>
                    <input type="submit" value="Search" />
                </form>
            </div>
        );
    }
}


export default function QueryView(props) {

    const params = queryString.parse(useLocation().search);
    return (
        <div style={{
            color: 'var(--base05)'
        }}>
            <h1>Query View</h1>
            <QueryControls query={params.query}></QueryControls>
            <h2>Summary</h2>
            <Summary query={params.query} api_url={props.api_url}></Summary>
            <h2>Results</h2>
            <ItemList query={params.query} api_url={props.api_url} />
        </div>);
}
