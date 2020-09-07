import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import TableModal from './TableModal';
import Popup from 'reactjs-popup';

import Column from './Column';
import { CellType, parseCellType } from './TableCell';
import { Resizable } from "re-resizable";
import { Cell } from 'react-table';
import { IoMdOpen, IoMdClose } from 'react-icons/io';

interface IProps {
    theme: { [k: string]: string; };
    // history: History<HistoryLocationState>;
}

interface TableSpec {
    cols: Array<string>;
    unique_cols: Array<string>;
    query: string;
    skip: number;
    limit: number;
}

interface TableData {
    column_names: Array<string>;
    column_types: Array<string>;
    rows: Array<{ [k: string]: any }>;
}

interface IState {
    tableSpec: TableSpec;
    tableData: null | TableData;
    shownQuery: string;
    shownLimit: number;
    shownSkip: number;
    previewOpen: boolean;
    previewData: Array<{ colname: string, type: CellType, value: string | Array<string> }>;
}

class TableView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const currentQueryParams = new URLSearchParams(window.location.search.substr(1));
        const initQuery = currentQueryParams.get('query') || '';
        const initCols = currentQueryParams.get('cols');
        const initSkip = currentQueryParams.get('skip') || '0';
        const initLimit = currentQueryParams.get('limit') || '500';
        console.log(initQuery, initCols, initSkip, initLimit);

        this.state = {
            tableSpec: {
                cols: ['name', 'bio'],
                unique_cols: ['name'],
                query: initQuery,
                skip: Number.parseInt(initSkip),
                limit: Number.parseInt(initLimit),
            },
            tableData: null,
            shownQuery: initQuery,
            shownSkip: Number.parseInt(initSkip),
            shownLimit: Number.parseInt(initLimit),
            previewOpen: false,
            previewData: [],
        };
    }

    fetchTable(spec: TableSpec) {
        const current_url = window.location.href;
        // const api_url = (current_url.startsWith('http://0.0.0.0') || current_url.startsWith('http://localhost')) ? 'http://0.0.0.0:5000' : 'https://api.modalsearch.com';

        const query_payload: { [k: string]: (string | number | Array<string | number>) } = {
            cols: spec.cols,
            query: encodeURIComponent(spec.query),
            skip: spec.skip,
            limit: spec.limit,
        };

        const qs = Object.keys(query_payload)
            .map(key => `${key}=${query_payload[key]}`)
            .join('&');

        window.location.href = `/?${qs}`;
    }

    componentDidMount() {
        const { tableSpec } = this.state;
        const current_url = window.location.href;
        const api_url = (current_url.startsWith('http://0.0.0.0') || current_url.startsWith('http://localhost')) ? 'http://0.0.0.0:5000' : 'https://api.modalsearch.com';
        console.log('Using API URL:', api_url);

        const query_payload: { [k: string]: (string | number | Array<string | number>) } = {
            cols: tableSpec.cols,
            unique_cols: tableSpec.unique_cols,
            query: encodeURIComponent(tableSpec.query),
            skip: tableSpec.skip,
            limit: tableSpec.limit,
        };

        const qs = Object.keys(query_payload)
            .map(key => `${key}=${query_payload[key]}`)
            .join('&');

        console.log('Qs:', qs);
        window.fetch(`${api_url}/table?${qs}`, {
            method: 'GET',
        }).then((r => r.json().then(response_data => {
            console.log(response_data);
            // window.history.pushState({}, '', `/table?${qs}`);
            this.setState({
                tableData: {
                    column_names: response_data.cols,
                    column_types: response_data.col_types,
                    rows: response_data.rows,
                },
            });
        })));
        // this.fetchTable(tableSpec);
    }


    render() {
        const { theme } = this.props;
        const { tableData, shownQuery, shownLimit, shownSkip, previewOpen, previewData } = this.state;

        let cols_data: { [k: string]: Array<any> } = {};
        tableData?.column_names.forEach(cname => {
            cols_data[cname] = [];
        });
        tableData?.rows.forEach(row => {
            tableData.column_names.forEach((cname, idx) => {
                cols_data[cname].push(row[idx]);
            });
        });

        const text_input_style = {
            backgroundColor: theme.base00,
            color: theme.base05,
            border: 'solid 1px',
            borderRadius: 3,
            borderColor: theme.base00,
            fontSize: 14,
            padding: 3,
            width: 75,
            marginRight: 5,
        }

        return (
            <div style={{ overflow: 'hidden', width: '100%', height: '100%', }}>
                <form style={{
                    backgroundColor: theme.base01,
                    padding: 10,
                }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input
                            type="text"
                            value={shownQuery}
                            onChange={(e) => this.setState({ shownQuery: e.target.value })}
                            style={{
                                flex: 1,
                                padding: 5,
                                fontSize: 16,
                                backgroundColor: theme.base00,
                                color: theme.base05,
                                border: 'solid 1px',
                                borderRadius: 3,
                                borderColor: theme.base03,
                            }}></input>
                        <button type="submit"
                            style={{
                                marginLeft: 5,
                                fontSize: 16,
                                padding: 3,
                                border: 'solid 1px',
                                borderColor: theme.base00,
                                backgroundColor: theme.base01,
                                cursor: 'pointer',
                                color: theme.base05,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                const currentSpec = this.state.tableSpec;
                                const currentQuery = this.state.shownQuery;
                                this.fetchTable({
                                    cols: currentSpec.cols,
                                    unique_cols: currentSpec.unique_cols,
                                    skip: this.state.shownSkip,
                                    limit: this.state.shownLimit,
                                    query: currentQuery,
                                })
                            }}>Search</button>
                    </div>
                    <div style={{ paddingTop: 10, color: theme.base04 }}>
                        <label>Limit: <input style={text_input_style} type="number" value={shownLimit} onChange={(e) => {
                            this.setState({ shownLimit: Number.parseInt(e.target.value) });
                        }}></input></label>
                        <label>Skip: <input style={text_input_style} type="number" value={shownSkip} onChange={(e) => {
                            this.setState({ shownSkip: Number.parseInt(e.target.value) });
                        }}></input></label>
                    </div>
                </form>
                <div style={{
                    backgroundColor: theme.base01,
                    border: 'solid 1px',
                    borderColor: theme.base02,
                    padding: 10,
                    color: theme.base05,
                    display: previewOpen ? 'flex' : 'none',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <div>
                        {previewData.map(x => {
                            return (
                                <div style={{}}>
                                    <span style={{ color: theme.base03, marginRight: 10 }}>
                                        {x.colname}:
                                </span>
                                    <span style={{ color: theme.base05 }}>
                                        {x.value}
                                        <button onClick={() => {
                                            const currentSpec = this.state.tableSpec;
                                            this.fetchTable({
                                                cols: currentSpec.cols,
                                                unique_cols: currentSpec.unique_cols,
                                                skip: this.state.shownSkip,
                                                limit: this.state.shownLimit,
                                                query: `"${x.value.toString()}"`,
                                            })
                                        }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: 16,
                                                color: theme.base03,
                                                cursor: 'pointer',
                                                verticalAlign: 'middle'
                                            }}><IoMdOpen></IoMdOpen></button>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: 'right', }}>
                        <button
                            onClick={() => this.setState({ previewOpen: false })}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: 16,
                                color: theme.base03,
                                cursor: 'pointer',
                            }}><IoMdClose></IoMdClose></button>
                    </div>
                </div>
                <div style={{ overflow: 'hidden', height: '100%' }}>
                    <div style={{
                        backgroundColor: theme.base00,
                        display: 'flex',
                        padding: 10,
                        flexDirection: 'row',
                        maxHeight: '100%',
                        overflowX: 'scroll',
                        overflowY: 'scroll'
                    }} className="tooltipBoundary">
                        {tableData?.column_names.map((cname, idx) =>
                            <Column
                                key={cname}
                                name={cname}
                                data={cols_data[cname]}
                                type={parseCellType(tableData.column_types[idx])}
                                theme={theme}
                                onCellClick={(value: string | Array<string>, type: CellType, idx: number) => {
                                    console.log(value, type, idx);
                                    console.log(tableData.rows[idx]);
                                    let prev_data: Array<{ type: CellType, colname: string, value: string | Array<string> }> = [];
                                    tableData.rows[idx].forEach((x: string, i: number) => {
                                        prev_data.push({
                                            type: parseCellType(tableData.column_types[i]),
                                            colname: tableData.column_names[i],
                                            value: x,
                                        })
                                    });
                                    this.setState({
                                        previewOpen: true,
                                        previewData: prev_data,
                                    });
                                }}></Column>
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

export default TableView;
