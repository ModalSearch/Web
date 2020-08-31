import React from 'react';
// import logo from './logo.svg';
import Table from './Components/Table';
import { CellType } from './Components/Table';
import { parse } from 'querystring';
import themes from './Styles/base16-themes';
import { AiOutlineArrowRight } from 'react-icons/ai';


interface IProps {
}

interface IState {
    col_names: Array<string>;
    col_types: Array<CellType>;
    row_data: Array<Array<string>>;
    schema_props: Array<string>;
    search_text: string;
    limit: number;
    skip: number;
    theme: {[k: string] : string; };
}


class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        const theme = themes["mexico-light"];
        const current_query = parse(window.location.search.slice(1));
        const x = current_query['cols'] !== undefined ? current_query['cols'].toString() : '';
        const q = current_query['q'] !== undefined ? current_query['q'].toString() : '';
        const limit = current_query['limit'] !== undefined ? Number.parseInt(current_query['limit'].toString()) : 200;
        const skip = current_query['skip'] !== undefined ? Number.parseInt(current_query['skip'].toString()) : 0;
        let cols: Array<string> = [];
        if (x !== undefined) {
            cols = x.split(',');
        }
        super(props);
        this.state = {
            col_names: cols,
            col_types: [],
            limit: limit,
            skip: skip,
            row_data: [],
            schema_props: [],
            search_text: q,
            theme: theme
        };
        this.add_col = this.add_col.bind(this);
        this.remove_col = this.remove_col.bind(this);
        this.set_skip = this.set_skip.bind(this);
        this.set_limit = this.set_limit.bind(this);
    }

    fetchData(q: string, cols: Array<string>, limit: Number, skip: Number) {
        q = q.length > 0 ? `?q=${encodeURIComponent(q)}` : '?';
        const cols_str = cols.length > 0 ? `&cols=${cols.join(',')}` : '';
        const limit_str = `&limit=${limit}`;
        const skip_str = `&skip=${skip}`;
        const req_url = 'http://0.0.0.0:3000' + q + cols_str + limit_str + skip_str;
        window.location.href = req_url;
    }

    componentDidMount() {
        const api_url = window.location.href.startsWith('http://0.0.0.0') ? 'http://0.0.0.0:5000' : 'https://api.modalsearch.com';
        fetch(`${api_url}/table${window.location.search}`).then(res => res.json()).then(data => {
            if (data.schema.properties !== undefined) {
                this.setState({
                    col_names: data.cols.filter((x: string) => x !== 'timestamp' && x !== 'url'),
                    col_types: data.cols.map((x: any) => {
                        if (x === 'timestamp') {
                            return CellType.Time;
                        } else if (x === 'url') {
                            return CellType.URL;
                        } else {
                            let col_type = data.schema.properties[x].type;
                            if (col_type === 'string') {
                                return CellType.String;
                            } else if (col_type === 'array') {
                                return CellType.Array;
                            } else {
                                throw Error(`Failed to handle col type: ${col_type}`);
                            }
                        }
                    }),
                    row_data: data.rows,
                    schema_props: Object.keys(data.schema.properties)
                });
            }
        });
    }

    set_skip(new_skip: number) {
        const {search_text, col_names, limit} = this.state;
        this.setState({skip: new_skip});
        // this.fetchData(search_text, col_names, limit, new_skip);
    }

    set_limit(new_limit: number) {
        const {search_text, col_names, skip} = this.state;
        this.setState({limit: new_limit});
        // this.fetchData(search_text, col_names, new_limit, skip);
    }

    remove_col(col_name: string) {
        const {col_names, limit, skip} = this.state;
        let new_cols = [];
        new_cols = col_names.filter(x => x !== col_name);
        this.fetchData(this.state.search_text, new_cols, limit, skip);
    }

    add_col(col_name: string) {
        const {col_names, limit, skip} = this.state;
        let new_cols = col_names.concat([col_name]);
        this.fetchData(this.state.search_text, new_cols, limit, skip);
    }

    render() {
        const { col_names, col_types, row_data, schema_props, search_text, limit, skip, theme } = this.state;
        return (
            <div className="App" style={{ backgroundColor: theme.base00, flex: 1, minHeight: '100%' }}>
                <form style={{ padding: 10, display: 'flex' }}>
                    <input type="text"
                        style={{
                            backgroundColor: theme.base00,
                            color: theme.base05,
                            padding: 5,
                            fontSize: 16,
                            border: 'solid 1px',
                            borderColor: theme.base03,
                            minWidth: 300,
                            marginRight: 5,
                            flex: 1,
                        }}
                        value={search_text}
                        onChange={(e) => { this.setState({ search_text: e.target.value }) }}></input>
                    <button style={{
                        background: 'none',
                        border: ' none',
                        color: theme.base05,
                        display: 'inherit',
                        margin: 'auto',
                        fontSize: 16,
                        cursor: 'pointer',

                    }} type="submit" onClick={(e) => {
                        e.preventDefault();
                        this.fetchData(this.state.search_text, this.state.col_names, limit, skip);
                    }}><AiOutlineArrowRight></AiOutlineArrowRight></button>
                </form>
                <Table
                    setText={(t) => {
                        // this.setState({search_text: t});
                        this.fetchData(t, this.state.col_names, limit, skip);
                    }}
                    theme={theme}
                    skip={skip}
                    limit={limit}
                    set_skip={this.set_skip}
                    set_limit={this.set_limit}
                    add_col={this.add_col}
                    remove_col={this.remove_col}
                    column_names={['timestamp', 'url'].concat(col_names)}
                    all_column_names={schema_props}
                    column_types={col_types}
                    rows_data={row_data}></Table>
            </div>
        );
    }

}

export default App;
