import React from 'react';
import { BrowserRouter as Router, Route, useLocation, useHistory } from "react-router-dom";
import queryString from 'query-string';
import ReactJson from 'react-json-view'

import ItemList from './ItemList';

import '../styles/json_inspector.css';


function pformat(obj, theme) {
    if (Array.isArray(obj)) {
        if (obj.length === 1) {
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
                <ReactJson enableClipboard={false} theme={theme} src={obj}/>

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


function Summary(props) {
    const summary_object = props.data;
    if (summary_object === undefined) {
        return <div>Loading Summary</div>
    }
    return (
        <div style={{
            display: 'flex',
            maxWidth: '100%',
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
                            }}>{pformat(summary_object[key], props.theme)}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
}



export default class QueryView extends React.Component {

    constructor(props) {
        super(props);
        const params = queryString.parse(window.location.search);
        this.state = {
            summary_data: undefined,
            view_data: undefined,
            query: params.query ? params.query : 'true'
        }
    }

    componentDidMount() {
        fetch(`${this.props.api_url}/summary?query=${this.state.query}`).then(response => response.json()).then(summary_data => this.setState({ summary_data }));
        fetch(`${this.props.api_url}/query?query=${this.state.query}`).then(response => response.json()).then(view_data => this.setState({ view_data }));
    }

    render() {
        const { theme } = this.props;
        return (
            <div style={{
                color: theme.base05,
            }}>
                <h1>Query View</h1>
                <div style={{
                    backgroundColor: theme.base01,
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
                <h2>Summary</h2>
                <Summary theme={theme} data={this.state.summary_data}/>
                <h2>Results</h2>
                <ItemList theme={theme} data={this.state.view_data}/>
            </div>
        );
    }
}
